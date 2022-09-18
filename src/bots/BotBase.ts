import { ILogger } from "../Logger/ILogger";

import Discord, {
  ChannelType,
  GatewayIntentBits,
  IntentsBitField,
  Message,
  TextBasedChannel,
} from "discord.js";
import { NamedLogger } from "../Logger/NamedLogger";

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
  id: string | undefined;
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
    this.token = props.token;
    this.name = props.name;
    this.logger = new NamedLogger(props.name);

    let client: Discord.Client;
    try {
      client = new Discord.Client({
        intents: new IntentsBitField(props.intents),
      });
    } catch (err) {
      this.logger.error("failed to create client");
      this.logger.error((err as Error).message);
      throw err;
    }

    this.client = client;

    client.on("ready", () => {
      this.logger.log("logged in successfully");
      this.id = this.id = client.user?.id;
    });
  }

  /**
   * Logs the bot in to Discord. Make sure to run this after you have
   * subscribed to all the events you need to.
   */
  login() {
    try {
      this.client.login(this.token);
      this.loggedIn = true;
    } catch (err) {
      this.logger.error("failed to log in");
      this.logger.error((err as Error).message);
    }
  }

  /**
   * Send a message to a channel, with error handling
   * @param messageText the text the message should contain
   * @param channel the channel to send to
   * @returns the sent message if successful, otherwise undefined
   */
  async sendMessage(
    messageText: string,
    channel: TextBasedChannel
  ): Promise<Message | undefined> {
    try {
      const sentMessage = channel.send(messageText);

      if (channel.type === ChannelType.DM) {
        this.logger.log("posted a message to a users DMs");
      } else {
        this.logger.log(`posted a message in #${channel.name}`);
      }
      return sentMessage;
    } catch (err) {
      this.logger.error("failed to post message");
      this.logger.error((err as Error).message);
      return undefined;
    }
  }

  /**
   * Send a message to a channel, with error handling
   * @param message the message to edit
   * @param newText the new text
   * @returns true if successful, false otherwise
   */
  async editMessage(message: Message, newText: string): Promise<boolean> {
    try {
      await message.edit(newText);

      if (message.channel.type === ChannelType.DM) {
        this.logger.log("edited a message in a users DMs");
      } else {
        this.logger.log(`edited a message in #${message.channel.name}`);
      }
      return true;
    } catch (err) {
      this.logger.error("failed to edit a message");
      this.logger.error((err as Error).message);
      return false;
    }
  }

  /**
   * Logs the bot out of Discord
   */
  dispose() {
    this.client.destroy();
  }
}
