import { Context } from "@netlify/functions";
import path from "path";
import { FCOGResponse } from "../../lib/FCOGResponse";

const resources = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
];

export default async function handler(request: Request, context: Context) {
  const isDEV = process.env.AWS_REGION === "dev";
  const currentURL = new URL(request.url);
  console.log(process.env.AWS_REGION, isDEV);
  const index = parseInt(currentURL.searchParams.get("index") || "0");
  const imageFileName = resources[index];

  const imageURL = new URL(
    isDEV
      ? `http://localhost:3999/public/${imageFileName}`
      : context.site.url! + imageFileName
  );
  const timestamp = Date.now();
  imageURL.searchParams.set("t", timestamp.toString());

  const templatePath = path.resolve(__dirname, "cover.ejs");

  return new FCOGResponse(templatePath, imageURL.toString(), {
    index,
    imageLength: resources.length,
  });
}

export const config = {
  path: "/",
};
