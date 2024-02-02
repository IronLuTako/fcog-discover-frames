import { Context } from "@netlify/functions";
import path from "path";
import { FCOGResponse } from "../../lib/FCOGResponse";

const ogLists = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
];
const ogTargets = [
  "https://warpcast.com/seangeng/0xedb2a886",
  "https://warpcast.com/rpj/0xff78b555",
  "https://warpcast.com/jam/0x308d98ae",
  "https://warpcast.com/seangeng/0xedb2a886",
  "https://warpcast.com/colin/0x8fb44184",
  "https://warpcast.com/cookie/0x35bbc5a0",
  "https://warpcast.com/riotgoools/0x87585135",
  "https://warpcast.com/cameron/0x3a04823b",
];

enum ButtonClickType {
  Prev = 1,
  Go,
  Next,
}

async function parseButtonClickResult(request: Request) {
  if (request.method !== "POST") return;
  const body = await request.json();
  const buttonIndex = body?.untrustedData?.buttonIndex;
  if (buttonIndex === 1) {
    return ButtonClickType.Prev;
  } else if (buttonIndex === 2) {
    return ButtonClickType.Go;
  } else if (buttonIndex === 3) {
    return ButtonClickType.Next;
  }
}

export default async function handler(request: Request, context: Context) {
  const clickType = await parseButtonClickResult(request);
  const currentIndex = parseInt(context.params?.index) || 0;

  if (clickType === ButtonClickType.Go) {
    return new Response(null, {
      status: 302,
      headers: {
        location: `/redirect?index=${currentIndex}`,
      },
    });
  }

  const isDEV = process.env.AWS_REGION === "dev";
  let nextIndex = currentIndex;

  if (clickType === ButtonClickType.Next) {
    nextIndex = (currentIndex + 1) % ogLists.length;
  } else if (clickType === ButtonClickType.Prev) {
    nextIndex = (currentIndex - 1 + ogLists.length) % ogLists.length;
  }

  const imageFileName = ogLists[nextIndex];

  const imageURL = new URL(
    isDEV
      ? `http://localhost:3999/public/${imageFileName}`
      : `${context.site.url!}/${imageFileName}`
  );
  const timestamp = Date.now();
  imageURL.searchParams.set("t", timestamp.toString());

  const templatePath = path.resolve(__dirname, "cover.ejs");

  console.log("next index: ", nextIndex);
  return new FCOGResponse(templatePath, imageURL.toString(), {
    index: nextIndex,
    imageLength: ogLists.length,
    hostURL: context.site.url!,
  });
}

export const config = {
  path: ["/", "/i/:index"],
};
