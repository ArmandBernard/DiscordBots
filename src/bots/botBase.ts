import { ILogger } from "../ILogger";

import Discord, { GatewayIntentBits, IntentsBitField } from "discord.js";

export type BotBaseProps = {
  /**
   * The name of the bot
   */
  name: string;
  /**
   * The token the bot will use to log in
   */
  token: string;
  /**
   * The logger the bot will use to log messages
   */
  logger: ILogger;
  /**
   * The intents the bot will subscribe to
   */
  intents: GatewayIntentBits[];
};

/**
 * Base class for all bots
 */
export abstract class BotBase {
  /**
   * The client for the bot
   */
  client: Discord.Client;
  logger: ILogger;
  name: string;
  private token: string;

  private _loggedIn = false;
  /**
   * Is the bot currently logged in?
   */
  get loggedIn(): boolean {
    return this._loggedIn;
  }
  private set loggedIn(value: boolean) {
    this._loggedIn = value;
  }

  /**
   * Constructor for BotBase
   * @param props The constructor props
   */
  constructor(props: BotBaseProps) {
    this.logger = props.logger;
    this.token = props.token;
    this.name = props.name;

    let client: Discord.Client;
    try {
      client = new Discord.Client({
        intents: new IntentsBitField(props.intents),
      });
    } catch (err) {
      this.logger.error(`failed to create client for ${this.name}`);
      this.logger.error((err as Error).message);
      throw err;
    }

    this.client = client;

    client.on("ready", () => {
      this.logger.log(`${this.name} logged in successfully`);
    });
  }

  /**
   * Logs the bot in to Discord. Make sure to run this after you have
   * subscribed to all the events you need to.
   */
  login() {
    try {
      this.logger.log(`logging in as ${this.name}`);
      this.client.login(this.token);
      this.loggedIn = true;
    } catch (err) {
      this.logger.error(`failed to log in as ${this.name}`);
      this.logger.error((err as Error).message);
    }
  }

  /**
   * Logs the bot out of Discord
   */
  dispose() {
    this.client.destroy();
  }
}
