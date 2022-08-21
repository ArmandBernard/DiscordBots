import { RatBot } from "./bots/RatBot/RatBot";
import { copyTemplate } from "./copyTemplate";
import { readFileSync } from "fs";
import { Logger } from "./Logger/Logger";
import { ILogger } from "./Logger/ILogger";
import { WeatherBot } from "./bots/WeatherBot/WeatherBot";

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

    const ratBotToken = settings.botTokens.ratBot;

    if (ratBotToken) {
      new RatBot({ token: ratBotToken, logger });
    }

    const weatherBotToken = settings.botTokens.weatherBot;
    const weatherAPIToken = settings.botTokens.weatherAPIToken;

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

Program.main();

/**
 * The expected shape of the applications settings file
 */
interface IAppSettings {
  botTokens: {
    ratBot: string | undefined;
    weatherBot: string | undefined;
    weatherAPIToken: string | undefined;
  };
}
