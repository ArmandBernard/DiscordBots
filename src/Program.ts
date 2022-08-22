import { RatBot } from "./bots/RatBot/RatBot";
import { copyTemplate } from "./AppSettings/copyTemplate";
import { readFileSync } from "fs";
import { Logger } from "./Logger/Logger";
import { ILogger } from "./Logger/ILogger";
import { WeatherBot } from "./bots/WeatherBot/WeatherBot";
import { IAppSettings } from "./AppSettings/IAppSettings";

export class Program {
  /**
   * Program entry point
   * @returns
   */
  static main() {
    const logger = new Logger();

    copyTemplate(logger);

    const settings = Program.loadSettings(logger);
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
  static loadSettings(logger: ILogger): IAppSettings | undefined {
    const jsonTxt = readFileSync("appSettings.json", "utf8");

    try {
      return JSON.parse(jsonTxt);
    } catch (err) {
      logger.error("failed to parse appSettings.json");
      return undefined;
    }
  }
}
