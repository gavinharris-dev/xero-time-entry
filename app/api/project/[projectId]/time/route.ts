import * as dfn from "date-fns";
import { decodeJwt } from "jose";

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } },
) {
  const headers = new Headers();

  const body = await request.json();

  const tennentShortCode = "\u0021hKtf\u0021"; //'!hKtf!';

  headers.set("xero-tenant-shortcode", tennentShortCode);
  headers.set("authorization", body.authorization);
  headers.set("cookie", body.cookie);

  headers.set("Content-Type", "application/json");

  headers.set("Accept", "application/json");

  const jwt = decodeJwt(body.authorization.replace("Bearer ", ""));

  console.log("JWT", jwt.xero_userid);

  // Object.entries(body).forEach(([k, v]) => headers.set(k, (v as string).replaceAll('\u0021', '!')));

  // console.log(Array.from(headers.values()));

  const newTimeEntries = await Promise.allSettled(
    body.data
      .map((te: any) => {
        return { ...te, userId: jwt.xero_userid };
      })
      .map(async (timeEntry: any) => {
        if (!timeEntry) {
          return;
        }
        const resp = await fetch(
          `https://go.xero.com/api/projects/projects/${params.projectId}/time`,
          {
            method: "POST",
            body: JSON.stringify(timeEntry),
            headers,
          },
        );
        if (!resp.ok) {
          throw new Error(
            `Submit Error ${resp.status}, ${
              resp.statusText
            }, ${await resp.text()}`,
          );
        }

        return resp.json();
      }),
  );

  newTimeEntries.forEach((te) => {
    switch (te.status) {
      case "rejected":
        console.error(te.reason);
        break;
      case "fulfilled":
        break;
    }
  });

  return new Response(JSON.stringify(newTimeEntries), { status: 200 });
}
