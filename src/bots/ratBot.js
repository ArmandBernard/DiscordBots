import Discord from "discord.js";

export class ratBot {
  constructor(client) {
    this.client = client;
  }

  static create(token) {
    const client = new Discord.Client();

    const bot = new ratBot(client);

    client.on("ready", () => {
      console.log("bot started");
    });

    client.login(token);

    return bot;
  }
}
