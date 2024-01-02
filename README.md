This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Get Xero CURL command

Open browser and login to Xero and navigate to Time Entries. In your browser open Dev Tools (I use Firefox to do this but Chrome would work too).
In Dev Tools, locate the Network Tab and find a request that is going to https://go.xero.com. Right click on this request and select Copy Value > As cURL.

Now navigate to http://localhost:3000 and put the copied cURL script into the "Capture Credentials" input at the bottom. Note this app will persist these Credentials
locally into your Local Storage; this is done within the ./lib/store.ts file. These credentials are fairly short lived, and will expire after 30 mins or so (I've
not looked into actual timing, this would be in the JWT).
