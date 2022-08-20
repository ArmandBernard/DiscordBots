import { ILogger } from "../ILogger";

import Discord, { GatewayIntentBits, IntentsBitField } from "discord.js";

export type BotBaseProps = {
  name: string;
  token: string;
  logger: ILogger;
  intents: GatewayIntentBits[];
};

export abstract class BotBase {
  client: Discord.Client;
  logger: ILogger;
  name: string;
  private token: string;
  private _loggedIn = false;

  get loggedIn(): boolean {
    return this._loggedIn;
  }

  private set loggedIn(value: boolean) {
    this._loggedIn = value;
  }

  constructor(props: BotBaseProps) {
    this.logger = props.logger;
    this.token = props.token;
    this.name = props.name;

    const client = new Discord.Client({
      intents: new IntentsBitField(props.intents),
    });

    this.client = client;

    client.on("ready", () => {
      this.logger.log(`${this.name} started successfully`);
    });
  }

  login() {
    try {
      this.client.login(this.token);
      this.loggedIn = true;
    } catch (err) {
      this.logger.error(`failed to log in as ${this.name}`);
      this.logger.error((err as Error).message);
    }
  }
}
