import { promises as fs } from "fs";
import { ILogger } from "../Logger/ILogger";
import { IAppSettings } from "./IAppSettings";

/**
 * The template for appSettings.json
 */
const appSettingsTemplate: IAppSettings = {
  ratBot: {
    token: "",
  },
  weatherBot: {
    token: "",
    weatherApiToken: "",
  },
  wordCounter: {
    token: "",
  },
};

/**
 * Create a template appSettings
 * @param logger
 * @returns true if a new file was create, false if not
 */
export async function createAppSettings(logger: ILogger): Promise<boolean> {
  try {
    await fs.writeFile(
      "appSettings.json",
      JSON.stringify(appSettingsTemplate, null, 2),
      { flag: "wx" }
    );
  } catch {
    return false;
  }
  logger.log("appSettings.json created");
  return true;
}
