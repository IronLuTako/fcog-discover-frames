import { Context } from "@netlify/functions";

const redirectTargets = [
  "https://warpcast.com/seangeng/0xedb2a886",
  "https://warpcast.com/rpj/0xff78b555",
  "https://warpcast.com/jam/0x308d98ae",
  "https://warpcast.com/seangeng/0xedb2a886",
  "https://warpcast.com/colin/0x8fb44184",
  "https://warpcast.com/cookie/0x35bbc5a0",
  "https://warpcast.com/riotgoools/0x87585135",
  "https://warpcast.com/cameron/0x3a04823b",
];

export default async function handler(request: Request, context: Context) {
  const index = parseInt(new URL(request.url).searchParams.get("index") || "0");
  return new Response("OK", {
    status: 200,
    headers: {
      //
    },
  });
}

export const config = {
  path: "/redirect",
};
