import fs from "fs";
import { ILogger } from "./Logger/ILogger";

/**
 * Copy the template settings file to the root directory
 * @param logger The logger to use
 */
export function copyTemplate(logger: ILogger) {
  if (!fs.existsSync("appSettings.json")) {
    fs.copyFileSync("templates/appSettings.template.json", "appSettings.json");
    logger.log("appSettings.json created");
  } else {
    logger.log("appSettings.json was found");
  }
}
