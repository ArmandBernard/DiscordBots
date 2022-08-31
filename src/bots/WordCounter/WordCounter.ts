import {
  TextBasedChannel,
  GatewayIntentBits,
  IntentsBitField,
  Message,
  ChannelType,
  Collection,
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

const mentionsRegex = /<@&\w+>/;

export class WordCounter extends BotBase {
  constructor(props: WordCounterProps) {
    super({
      ...props,
      name: "WordCounter",
      intents,
    });

    // when a message is created
    this.client.on("messageCreate", async (message) => {
      // if it mentions WordCounter
      if (this.id && message.mentions.has(this.id)) {
        // reply with the rat gif
        const reply = await WordCounter.parseRequest(message);

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

  static async parseRequest(message: Message): Promise<string> {
    const content = message.content;

    // remove mentions
    const words = content.replace(mentionsRegex, "").trim();

    // get all messages
    const messages = (await message.channel.messages.fetch({
      limit: 100,
    })) as Collection<string, Message>;

    const filtered = messages.filter((m) => m.content.includes(words));

    if (message.channel.type === ChannelType.DM) {
      return `There are ${filtered.size} messages containing "${words}" in the last 100 messages of our correspondence.`;
    } else {
      return `There are ${
        filtered.size
      } messages containing "${words}" in the last 100 messages of ${message.channel.toString()}`;
    }
  }
}
