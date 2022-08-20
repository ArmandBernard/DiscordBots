import { GatewayIntentBits, IntentsBitField } from "discord.js";
import { ILogger } from "../ILogger";
import { BotBase } from "./botBase";

const regex = /\brat\b/i;

const intents: GatewayIntentBits[] = [
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
];

interface RatBotProps {
  /**
   * The token the bot will use to log in
   */
  token: string;
  /**
   * The logger the bot will use to log messages
   */
  logger: ILogger;
}

/**
 * A bot that will reply to messages containing the word "rat" with a gif of a
 * spinning rat. Fun.
 */
export class RatBot extends BotBase {
  constructor(props: RatBotProps) {
    super({
      ...props,
      name: "ratBot",
      intents,
    });

    // when a message is created
    this.client.on("messageCreate", (message) => {
      // if it contains rat
      if (RatBot.containsRat(message.content)) {
        try {
          // post the rat gif
          message.channel.send("https://i.imgur.com/KqvqLg3.gif");
        } catch (err) {
          this.logger.error("failed to post message");
          this.logger.error((err as Error).message);
        }
      }
    });

    this.login();
  }

  /**
   * Check if the message contains "rat"
   * @param message the message to check
   * @returns true if the message contains "rat"
   */
  static containsRat(message: string): boolean {
    return regex.exec(message) != null;
  }
}
