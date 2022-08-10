import { ratBot } from "./bots/ratBot";
import { copyTemplate } from "./copyTemplate";
import { readFileSync } from "fs";
import { Logger } from "./Logger";

main();

function main() {
  const logger = new Logger();

  copyTemplate(logger);

  const jsonTxt = readFileSync("appSettings.json", "utf8");

  let settings;

  try {
    settings = JSON.parse(jsonTxt);
  } catch (err) {
    logger.error("failed to parse appSettings.json");
    logger.log("exiting");
    return;
  }

  const ratBotToken = settings.botTokens?.ratBot;

  if (ratBotToken) {
    logger.log("starting ratBot");
    ratBot.create(ratBotToken);
  }
}
