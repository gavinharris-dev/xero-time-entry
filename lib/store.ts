import { isSameDay } from "date-fns";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";

type Task = {
  taskId: string;
  projectId: string;
  name: string;
};

type Project = {
  projectId: string;
  name: string;
  contactName: string;
  tasks?: Task[];
};

type NetworkResponse<T> = {
  items: T[];
};

type TimeEntry = {
  userId: string;
  timeEntryId: string;
  contactId: string;
  contactName: string;
  projectId: string;
  projectName: string;
  taskId: string;
  taskName: string;
  dateUtc: string;
  timeZone: string;
  dateEnteredUtc: string;
  duration: number;
  status: "ACTIVE" | "INVOICED";
  userName: string;
  isProjectAccessible: boolean;
};

type Data = {
  curl?: string;
  projects?: Project[];
  setCurl: (c: string) => void;
  selectProject: (project: Project | undefined) => void;
  selectTask: (task: Task | undefined) => void;
  project: Project;
  task?: Task;
  selectDays: (days: Date[]) => void;
  days: Date[];
  timeEntries?: TimeEntry[];
  submitHoursForSelectedDays: (hours: number) => Promise<void>;
};

function getHttpHeaders(curl: string) {
  if (!curl) return;

  const header = new Headers();
  const s = curl.split("-H ");

  for (let i = 1; i < s.length; i++) {
    let str = s[i];
    str = str
      .replace(`$'`, "")
      .replaceAll("'", "")
      .replace("--compressed", "")
      .trim();
    const h = str.split(":");
    if (h.length === 2) {
      header.append(h[0], h[1].replaceAll("\u0021", "!"));
    }
  }

  return header;
}

async function getProjects(
  curl: string,
): Promise<NetworkResponse<Project> | null> {
  const headers = getHttpHeaders(curl);

  if (!headers) return null;

  console.log("Headers", headers.values.length);
  headers.forEach((value, name) => console.log(name, value));

  const body: { [k: string]: string } = {};

  headers.forEach((v, k) => (body[k] = v.replaceAll(" \\", "")));

  const resp = await fetch("./api/project", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    console.log("Resp is not ok");
    throw new Error(await resp.text());
  }
  return resp.json();
}

async function getTask(project: Project, curl: string) {
  const headers = getHttpHeaders(curl);

  if (!headers) return null;

  console.log("Headers", headers.values.length);
  headers.forEach((value, name) => console.log(name, value));

  const body: { [k: string]: string } = {};

  headers.forEach((v, k) => (body[k] = v.replaceAll(" \\", "")));

  const resp = await fetch(`./api/project/${project.projectId}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    console.log("Resp is not ok");
    throw new Error(await resp.text());
  }
  return resp.json();
}

async function getTimeEntries(
  curl: string,
): Promise<NetworkResponse<TimeEntry> | null> {
  const headers = getHttpHeaders(curl);

  if (!headers) return null;

  const body: { [k: string]: string } = {};

  headers.forEach((v, k) => (body[k] = v.replaceAll(" \\", "")));

  const resp = await fetch(`./api/project/time`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    console.log("Resp is not ok");
    throw new Error(await resp.text());
  }
  return resp.json();
}

async function submitHoursForSelectedDays(
  hours: number,
  task: Task,
  days: Date[],
  timeEntries: TimeEntry[],
  curl: string,
) {
  // 2. Check we don't already have a TimeEntry for the day, if we do then make sure the Hours don't go over 10

  const hoursDuration = hours * 60;

  const data = days.map((day) => {
    console.log("Day", typeof day);
    const utcDay = new Date(
      Date.UTC(
        day.getUTCFullYear(),
        day.getUTCMonth(),
        day.getUTCDate(),
        14,
        0,
        0,
      ),
    );
    const te = timeEntries?.find(
      (te) => te && isSameDay(new Date(Date.parse(te.dateUtc)), utcDay),
    );

    if (te) {
      if (te.duration + hoursDuration > 600) {
        console.log("Refused to create - Too much time", day);
        return null;
      }
    }

    return {
      taskId: task.taskId,
      duration: hoursDuration,
      dateUtc: utcDay.toISOString(),
      timeEntryType: "duration",
    };
  });

  const headers = getHttpHeaders(curl);

  if (!headers) return null;

  const body: { [k: string]: string } = {};

  headers.forEach((v, k) => (body[k] = v.replaceAll(" \\", "")));

  body.data = data;

  const resp = await fetch(`./api/project/${task.projectId}/time`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    console.log("Resp is not ok");
    throw new Error(await resp.text());
  }
  return resp.json();
}

export const useXeroTimeStore = create<Data>()(
  persist(
    devtools(
      (set, get) => ({
        submitHoursForSelectedDays: async (hours: number) => {
          const { task, days, curl, timeEntries } = get();

          if (!task) return;
          if (days.length === 0) return;
          if (!curl) return;

          const newTimeEntries = await submitHoursForSelectedDays(
            hours,
            task,
            days,
            timeEntries || [],
            curl,
          );

          const x = (get().timeEntries || []).concat(
            newTimeEntries.map((te) => {
              if (te.status === "fulfilled") {
                return te.value;
              }
            }),
          );

          set({ timeEntries: x, days: [] });
        },
        timeEntries: [],
        setCurl: (c) => {
          set({ curl: c });

          getTimeEntries(c).then((te) => set({ timeEntries: te?.items || [] }));

          getProjects(c)
            .then((p) => {
              if (p) {
                set({ projects: p.items });

                return Promise.all(
                  p.items.map(async (proj) => {
                    proj.tasks = (await getTask(proj, c)).items;
                    return proj;
                  }),
                );
              }
            })
            .then((p) => {
              if (p) {
                set({ projects: p });
              }
            });
        },
        project: {
          projectId: "",
          name: "Select",
          contactName: "Select",
        },
        selectProject: (p) => {
          if (!p) {
            p = {
              projectId: "",
              name: "Select",
              contactName: "Select",
            };
          }
          set({ project: p });
        },
        selectTask: (t) => {
          set({ task: t });
        },
        days: [],
        selectDays: (days) => {
          set({ days });
        },
      }),
      {
        name: "xero-data",
      },
    ),
    {
      name: "xer-data",
    },
  ),
);
