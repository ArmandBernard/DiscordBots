import Discord, { ClientOptions } from "discord.js";
import { ILogger } from "../ILogger";

const regex = /\brat\b/i;

export class ratBot {
  client: Discord.Client;
  logger: ILogger;

  constructor(client: Discord.Client, token: string, logger: ILogger) {
    this.client = client;
    this.logger = logger;

    client.on("ready", () => {
      logger.log("bot started");
    });

    // when a message is created
    client.on("messageCreate", (message) => {
      // if it contains rat
      if (regex.exec(message.content)) {
        // post the rat gif
        message.channel.send("https://i.imgur.com/KqvqLg3.gif");
      }
    });

    client.login(token);
  }

  static create(token: string, logger: ILogger) {
    const client = new Discord.Client({} as ClientOptions);

    return new ratBot(client, token, logger);
  }
}
