import { ratBot } from "./bots/ratBot";
import { copyTemplate } from "./copyTemplate";
import { readFileSync } from "fs";
import { Logger } from "./Logger";
import { ILogger } from "./ILogger";

export class Program {
  static main() {
    const logger = new Logger();

    copyTemplate(logger);

    const settings = Program.loadConfig(logger);
    if (!settings) {
      logger.log("exiting");
      return;
    }

    const ratBotToken = settings.botTokens?.ratBot;

    if (ratBotToken) {
      logger.log("starting ratBot");
      ratBot.create(ratBotToken, logger);
    }
  }

  static loadConfig(logger: ILogger): IAppSettings | undefined {
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

interface IAppSettings {
  botTokens: {
    ratBot: string;
  };
}
