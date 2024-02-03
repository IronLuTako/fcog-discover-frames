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
  const domain = context.site.url!;

  if (clickType === ButtonClickType.Go) {
    return new Response(null, {
      status: 302,
      headers: {
        location: `${domain}/redirect?index=${currentIndex}`
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
      ? `http://localhost:3999/${imageFileName}`
      : `${domain}/${imageFileName}`
  );
  const timestamp = Date.now();
  imageURL.searchParams.set("t", timestamp.toString());

  const templatePath = path.resolve(__dirname, "cover.ejs");

  return new FCOGResponse(templatePath, imageURL.toString(), {
    index: nextIndex,
    imageLength: ogLists.length,
    hostURL: domain,
  });
}

export const config = {
  path: ["/", "/i/:index"],
};
