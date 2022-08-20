import Discord, { ClientOptions } from "discord.js";

const regex = /\brat\b/i;

export class ratBot {
  client: Discord.Client;
  constructor(client: Discord.Client) {
    this.client = client;
  }

  static create(token: string) {
    const client = new Discord.Client({} as ClientOptions);

    const bot = new ratBot(client);

    client.on("ready", () => {
      console.log("bot started");
    });

    client.login(token);

    // when a message is created
    client.on("messageCreate", (message) => {
      // if it contains rat
      if (regex.exec(message.content)) {
        // post the rat gif
        message.channel.send("https://i.imgur.com/KqvqLg3.gif");
      }
    });

    return bot;
  }
}
