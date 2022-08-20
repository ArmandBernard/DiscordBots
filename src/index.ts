import { RatBot } from "./bots/ratBot";
import { copyTemplate } from "./copyTemplate";
import { readFileSync } from "fs";
import { Logger } from "./Logger";
import { ILogger } from "./ILogger";

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

    const ratBotToken = settings.botTokens?.ratBot;

    if (ratBotToken) {
      new RatBot({ token: ratBotToken, logger });
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
    ratBot: string;
  };
}
