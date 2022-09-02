import {
  TextBasedChannel,
  GatewayIntentBits,
  IntentsBitField,
  Message,
  ChannelType,
  Collection,
  MessageMentions,
} from "discord.js";
import { ILogger } from "../../Logger/ILogger";
import { BotBase } from "../BotBase";

const intents: GatewayIntentBits[] = [
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
];

interface WordCounterProps {
  /**
   * The token the bot will use to log in
   */
  token: string;
  /**
   * The logger the bot will use to log messages
   */
  logger: ILogger;
}

const userMentionRegex = new RegExp(MessageMentions.UsersPattern.source, "g");
const rolesMentionRegex = new RegExp(MessageMentions.RolesPattern.source, "g");

export class WordCounter extends BotBase {
  constructor(props: WordCounterProps) {
    super({
      ...props,
      name: "WordCounter",
      intents,
    });

    // when a message is created
    this.client.on("messageCreate", async (message) => {
      // if it mentions WordCounter and is not from the bot
      if (
        this.id &&
        message.mentions.has(this.id) &&
        message.author.id !== this.id
      ) {
        // parse their request
        const request = WordCounter.parseRequest(message.content);

        const reply = await WordCounter.prepareReply(message, request, this.id);

        this.sendReply(reply, message.channel);
      }
    });

    this.login();
  }

  sendReply(reply: string, channel: TextBasedChannel) {
    try {
      channel.send(reply);

      if (channel.type === ChannelType.DM) {
        this.logger.log("posted a reply to a user in DMs");
      } else {
        this.logger.log(`posted a reply in ${channel.name}`);
      }
    } catch (err) {
      this.logger.error("failed to post reply");
      this.logger.error((err as Error).message);
    }
  }

  static parseRequest(request: string): string {
    // remove mentions of both users and roles
    return request
      .replace(userMentionRegex, "")
      .replace(rolesMentionRegex, "")
      .trim();
  }

  static escapeRegex(str: string) {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  static checkMessage = (
    message: Message,
    request: string,
    myId: string
  ): boolean => {
    // early return if this bot is the author or the bot is mentioned
    if (message.author.id === myId || message.mentions.has(myId)) {
      return false;
    }
    // escape the request so it cna be safely put in regex
    const escapedRequest = this.escapeRegex(request);

    // create the search regex
    const containsRequest = new RegExp(`(^|\\W)${escapedRequest}(\\W|$)`, "i");

    // check the message
    return containsRequest.test(message.content);
  };

  static async prepareReply(
    message: Message,
    request: string,
    myId: string
  ): Promise<string> {
    // get all messages
    const messages = (await message.channel.messages.fetch({
      limit: 100,
    })) as Collection<string, Message>;

    const filtered = messages.filter((m) =>
      WordCounter.checkMessage(m, request, myId)
    );

    if (message.channel.type === ChannelType.DM) {
      return `There are ${filtered.size} messages containing "${request}" in the last 100 messages of our correspondence.`;
    } else {
      return `There are ${
        filtered.size
      } messages containing "${request}" in the last 100 messages of ${message.channel.toString()}`;
    }
  }
}
