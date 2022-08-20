import { GatewayIntentBits, IntentsBitField } from "discord.js";
import { ILogger } from "../ILogger";
import { BotBase } from "./botBase";

const regex = /\brat\b/i;

const intents: GatewayIntentBits[] = [
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
];

export class RatBot extends BotBase {
  constructor(token: string, logger: ILogger) {
    super({ name: "ratBot", token, logger, intents });

    // when a message is created
    this.client.on("messageCreate", (message) => {
      // if it contains rat
      if (RatBot.containsRat(message.content)) {
        try {
          // post the rat gif
          message.channel.send("https://i.imgur.com/KqvqLg3.gif");
        } catch (err) {
          logger.error("failed to post message");
          logger.error((err as Error).message);
        }
      }
    });

    this.login();
  }

  // check if the message contains "rat"
  static containsRat(message: string): boolean {
    return regex.exec(message) != null;
  }
}
