import {
  ChannelType,
  GatewayIntentBits,
  IntentsBitField,
  Message,
} from "discord.js";
import { BotBase } from "../BotBase";

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
}

/**
 * A bot that will reply to messages containing the word "rat" with a gif of a
 * spinning rat. Fun.
 */
export class RatBot extends BotBase {
  constructor(props: RatBotProps) {
    super({
      ...props,
      name: "RatBot",
      intents,
    });

    // when a message is created
    this.client.on("messageCreate", (message) => {
      // if it contains rat
      if (RatBot.containsRat(message.content)) {
        // reply with the rat gif
        this.replyWithGif(message);
      }
    });

    this.login();
  }

  /**
   * Reply to a user's message with a gif of a spinning rat
   * @param message the message to reply to
   */
  replyWithGif(message: Message) {
    try {
      // post the rat gif
      message.channel.send("https://i.imgur.com/KqvqLg3.gif");

      if (message.channel.type !== ChannelType.DM) {
        this.logger.log(`posted a reply in ${message.channel.name}`);
      } else {
        this.logger.log("posted a reply to a user in DMs");
      }
    } catch (err) {
      this.logger.error("failed to post reply");
      this.logger.error((err as Error).message);
    }
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
