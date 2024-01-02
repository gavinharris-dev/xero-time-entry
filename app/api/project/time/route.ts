import * as dfn from "date-fns";
import { decodeJwt } from "jose";

export async function POST(request: Request) {
  const headers = new Headers();

  const body = await request.json();

  const tennentShortCode = "\u0021hKtf\u0021"; //'!hKtf!';

  headers.set("xero-tenant-shortcode", tennentShortCode);
  headers.set("authorization", body.authorization);
  headers.set("cookie", body.cookie);

  const jwt = decodeJwt(body.authorization.replace("Bearer ", ""));

  console.log("JWT", jwt.xero_userid);

  // Object.entries(body).forEach(([k, v]) => headers.set(k, (v as string).replaceAll('\u0021', '!')));

  // console.log(Array.from(headers.values()));

  const today = new Date();
  const start = dfn.add(today, { months: -12 });

  const todayFmt = dfn
    .add(today, { hours: -today.getTimezoneOffset() })
    .toISOString();
  const startFmt = dfn
    .add(start, { hours: -today.getTimezoneOffset() })
    .toISOString();

  console.log(
    "TE",
    `https://go.xero.com/api/projects/time?dateAfterUtc=${startFmt}&dateBeforeUtc=${todayFmt}&userId=${jwt.xero_userid}`,
  );

  const resp = await fetch(
    `https://go.xero.com/api/projects/time?dateAfterUtc=${startFmt}&dateBeforeUtc=${todayFmt}&userId=${jwt.xero_userid}`,
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
