import fs from "fs";

export function copyTemplate(logger) {
  if (!fs.existsSync("appSettings.json")) {
    fs.copyFileSync("templates/appSettings.template.json", "appSettings.json");
    logger.log("appSettings.json created");
  } else {
    logger.log("appSettings.json was found");
  }
}
