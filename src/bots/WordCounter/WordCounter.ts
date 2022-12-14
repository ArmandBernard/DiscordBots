import {
  GatewayIntentBits,
  IntentsBitField,
  Message,
  ChannelType,
  MessageMentions,
  TextBasedChannel,
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

        // tell the user to wait
        const sentMessage = await this.sendSearchingMessage(
          request,
          message.channel
        );

        if (!sentMessage) {
          return;
        }

        const reply = await WordCounter.prepareReply(message, request, this.id);

        // edit the sent message
        this.editMessage(sentMessage, reply);
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

  /**
   * Tell the user to wait while we get check the messages
   * @param request what the user is after
   * @param channel the channel we're searching through
   * @returns the sent message, so it can be edited later
   */
  async sendSearchingMessage(
    request: string,
    channel: TextBasedChannel
  ): Promise<Message<boolean> | undefined> {
    const messageText = `Looking for the word(s) "${request}" in the last year of messages in ${
      channel.type === ChannelType.DM ? "these DMs" : channel.toString()
    }...`;

    return await this.sendMessage(messageText, channel);
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
    dateLimit.setDate(dateLimit.getDate() - 365);

    const { messages, totalParsed } = await MessageFetcher.getAllMessages(
      message.channel,
      dateLimit,
      (m) => WordCounter.checkMessage(m, request, myId)
    );

    let reply = `There are ${
      messages.length
    } messages containing "${request}" since ${dateLimit.toLocaleDateString()} (${totalParsed} messages) in ${
      message.channel.type === ChannelType.DM
        ? "our correspondence"
        : message.channel.toString()
    }.`;

    if (messages.length === 0) {
      return reply;
    }

    reply += "\n- User breakdown -\n";

    // create a list of users and their count
    const userMap: Map<string, number> = new Map();

    messages.forEach((m) => {
      // increment the count if it exists, or set it to 0 if not
      userMap.set(m.author.username, (userMap.get(m.author.username) ?? 0) + 1);
    });

    // add per-user counts to string
    reply += [...userMap.entries()]
      .filter(([, count]) => count > 0)
      .map(([author, count]) => `${author}: ${count}`)
      .join("; ");

    return reply;
  }
}
