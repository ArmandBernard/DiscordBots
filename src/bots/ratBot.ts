import Discord, { ClientOptions } from "discord.js";

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

    return bot;
  }
}
