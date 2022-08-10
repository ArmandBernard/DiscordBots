import fs from "fs";

export function copyTemplate() {
  if (!fs.existsSync("appSettings.json")) {
    fs.copyFileSync("templates/appSettings.template.json", "appSettings.json");
  }
}
