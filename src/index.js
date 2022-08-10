import { ratBot } from "./bots/ratBot.js";
import { copyTemplate } from "./copyTemplate.js";
import { readFileSync } from "fs";

copyTemplate();

const jsonTxt = readFileSync("appSettings.json", "utf8");

const settings = JSON.parse(jsonTxt);

const ratBotToken = settings.botTokens?.ratBot;

if (ratBotToken) {
  const ratBot1 = ratBot.create(ratBotToken);
}
