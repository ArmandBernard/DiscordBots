import { promises as fs } from "fs";
import { ILogger } from "../Logger/ILogger";
import { IAppSettings } from "./IAppSettings";

const appSettingsTemplate: IAppSettings = {
  ratBot: {
    token: "",
  },
  weatherBot: {
    token: "",
    weatherApiToken: "",
  },
};

/**
 * Copy the template settings file to the root directory
 * @param logger The logger to use
 */
export async function copyTemplate(logger: ILogger) {
  try {
    await fs.writeFile(
      "appSettings.json",
      JSON.stringify(appSettingsTemplate, null, 2),
      { flag: "wx" }
    );
  } catch {
    return;
  }
  logger.log("appSettings.json created");
}
