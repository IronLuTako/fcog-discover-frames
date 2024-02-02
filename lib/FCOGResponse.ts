import ejs from "ejs";
import fs from "fs";

function getResponseHTML(
  imageURL: string,
  templatePath: string,
  otherArgs: any = {}
) {
  return ejs.render(fs.readFileSync(templatePath, "utf-8"), {
    imageURL,
    ...otherArgs,
  });
}

export class FCOGResponse extends Response {
  constructor(templatePath: string, imageURL: string, otherArgs: any = {}) {
    super(getResponseHTML(imageURL, templatePath, otherArgs), {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
}
