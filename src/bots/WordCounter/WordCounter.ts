import {
  GatewayIntentBits,
  IntentsBitField,
  Message,
  ChannelType,
  MessageMentions,
  TextChannel,
} from "discord.js";
import { MessageFetcher } from "../../Services/MessageFetcher";
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

        this.sendMessage(reply, message.channel);
      }
    });

    this.login();
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

  // filter out messages not containing the words
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
    // make a limit of 7 days
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 7);

    const messages = await MessageFetcher.getAllMessages(
      message.channel as TextChannel,
      (m) => WordCounter.checkMessage(m, request, myId),
      dateLimit
    );

    if (message.channel.type === ChannelType.DM) {
      return `There are ${
        messages.length
      } messages containing "${request}" since ${dateLimit.toLocaleDateString()} in our correspondence.`;
    } else {
      return `There are ${
        messages.length
      } messages containing "${request}" since ${dateLimit.toLocaleDateString()} in #${message.channel.toString()}`;
    }
  }
}
