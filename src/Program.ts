import { RatBot } from "./bots/RatBot/RatBot";
import { createAppSettings } from "./AppSettings/appSettingsTemplate";
import { promises as fs } from "fs";
import { Logger } from "./Logger/Logger";
import { ILogger } from "./Logger/ILogger";
import { WeatherBot } from "./bots/WeatherBot/WeatherBot";
import { IAppSettings } from "./AppSettings/IAppSettings";

export class Program {
  /**
   * Program entry point
   * @returns
   */
  static async main() {
    const logger = new Logger();

    const created = await createAppSettings(logger);

    if (created) {
      logger.log("edit the appSettings.json, then restart the application.");
      logger.log("exiting");
      return;
    }

    const settings = await Program.loadSettings(logger);
    if (!settings) {
      logger.log("exiting");
      return;
    }

    const ratBotToken = settings.ratBot?.token;

    if (ratBotToken) {
      new RatBot({ token: ratBotToken, logger });
    }

    const weatherBotToken = settings.weatherBot?.token;
    const weatherAPIToken = settings.weatherBot?.weatherApiToken;

    if (weatherBotToken && weatherAPIToken) {
      new WeatherBot({
        token: weatherBotToken,
        weatherKey: weatherAPIToken,
        logger,
      });
    }
  }

  /**
   * Load the settings file for the application
   * @param logger
   * @returns the settings file
   */
  static async loadSettings(
    logger: ILogger
  ): Promise<IAppSettings | undefined> {
    let jsonTxt: string;
    try {
      jsonTxt = await fs.readFile("appSettings.json", "utf8");
    } catch (e) {
      logger.error("failed to read appSettings.json");
      logger.error((e as Error).message);
      return undefined;
    }

    try {
      return JSON.parse(jsonTxt);
    } catch (err) {
      logger.error("failed to parse appSettings.json");
      return undefined;
    }
  }
}
