import { type NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } },
) {
  const headers = new Headers();

  const body = await request.json();

  const tennentShortCode = "\u0021hKtf\u0021"; //'!hKtf!';

  headers.set("xero-tenant-shortcode", tennentShortCode);
  headers.set("authorization", body.authorization);
  headers.set("cookie", body.cookie);

  console.log(body.authorization);

  // Object.entries(body).forEach(([k, v]) => headers.set(k, (v as string).replaceAll('\u0021', '!')));

  // console.log(Array.from(headers.values()));

  const resp = await fetch(
    `https://go.xero.com/api/projects/projects/${params.projectId}/tasks`,
    {
      headers,
    },
  );
  if (!resp.ok) {
    console.log("2. Resp is not ok", resp.status, resp.statusText);

    console.log("Request Headers", resp.headers);
    console.log(await resp.text());

    throw new Error();
  }

  return new Response(JSON.stringify(await resp.json()), { status: 200 });
}
