import fs from "fs";
import { ILogger } from "./ILogger";

export function copyTemplate(logger: ILogger) {
  if (!fs.existsSync("appSettings.json")) {
    fs.copyFileSync("templates/appSettings.template.json", "appSettings.json");
    logger.log("appSettings.json created");
  } else {
    logger.log("appSettings.json was found");
  }
}
