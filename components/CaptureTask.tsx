import * as React from "react";
import { useXeroTimeStore } from "@/lib/store";
import { SelectItem, SelectViewport } from "@radix-ui/react-select";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";

import { Cross1Icon } from "@radix-ui/react-icons";

export function CaptureTask() {
  const project = useXeroTimeStore((s) => s.project);

  const setTask = useXeroTimeStore((s) => s.selectTask);
  const task = useXeroTimeStore((s) => s.task);

  if (!project) {
    return null;
  }

  if (task) {
    return (
      <div className="space-y-2 flex gap-2 justify-center items-center">
        <p>{task.name}</p>
        <Button className="h-5">
          <Cross1Icon onClick={() => setTask(undefined)} />
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      Project Tasks: {project.tasks?.length || "N/A"}
      <Label htmlFor="task">Task</Label>
      <Select
        disabled={!Boolean(project.tasks)}
        onValueChange={(value) => {
          const task = project.tasks?.find((t) => t.taskId === value);
          task && setTask(task);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Task" />
        </SelectTrigger>
        <SelectContent>
          <SelectViewport>
            <SelectItem value="Test">Test</SelectItem>
            {project && project.tasks
              ? project.tasks.map((t) => {
                  return (
                    <SelectItem
                      id={t.taskId}
                      value={t.taskId}
                      key={t.taskId}
                      onClick={() => alert(t.name)}
                      onSelect={() => setTask(t)}
                    >
                      {t.name}
                    </SelectItem>
                  );
                })
              : null}
          </SelectViewport>
        </SelectContent>
      </Select>
    </div>
  );
}
