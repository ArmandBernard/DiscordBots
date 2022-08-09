import { botBase } from "./botBase";

export class ratBot extends botBase {
  constructor(client) {
    this.client = client;
  }

  static create() {
    const client = new Discord.Client();

    const bot = new ratBot(client);

    client.on("ready", () => {
      console.log("bot started");
    });

    client.login("");

    return bot;
  }
}
