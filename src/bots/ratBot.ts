import Discord, { IntentsBitField } from "discord.js";
import { ILogger } from "../ILogger";

const regex = /\brat\b/i;

const intents = [
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
];

export class ratBot {
  client: Discord.Client;
  logger: ILogger;

  static containsRat(message: string): boolean {
    return regex.exec(message) != null;
  }

  constructor(client: Discord.Client, token: string, logger: ILogger) {
    this.client = client;
    this.logger = logger;

    client.on("ready", () => {
      logger.log("bot started");
    });

    // when a message is created
    client.on("messageCreate", (message) => {
      // if it contains rat
      if (ratBot.containsRat(message.content)) {
        try {
          // post the rat gif
          message.channel.send("https://i.imgur.com/KqvqLg3.gif");
        } catch (err) {
          logger.error("failed to post message");
          logger.error((err as Error).message);
        }
      }
    });

    try {
      client.login(token);
    } catch (err) {
      logger.error("failed to log in");
      logger.error((err as Error).message);
    }
  }

  static create(token: string, logger: ILogger) {
    const client = new Discord.Client({
      intents: new IntentsBitField(intents),
    });

    return new ratBot(client, token, logger);
  }
}
