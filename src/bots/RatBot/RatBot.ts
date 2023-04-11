import { GatewayIntentBits, IntentsBitField } from "discord.js";
import { BotBase } from "../BotBase";

const ratRegex = /\brat(s?)\b/i;
const monkeyRegex = /\b(monkey(s?)|ape(s?)|gorilla(s?))\b/i;
const goblinRegex = /\b(goblin(s?)|fuling(s?)|gremlin(s?))\b/i;

const intents: GatewayIntentBits[] = [
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
];

interface RatBotProps {
  /**
   * The token the bot will use to log in
   */
  token: string;
}

/**
 * A bot that will reply to messages containing the word "rat" with a gif of a
 * spinning rat. Fun.
 */
export class RatBot extends BotBase {
  constructor(props: RatBotProps) {
    super({
      ...props,
      name: "RatBot",
      intents,
    });

    // when a message is created
    this.client.on("messageCreate", async (message) => {
      // don't do anything if this bot is the sender or message does not contain keyword
      if (message.author.id === this.id) {
        return;
      }

      // if it contains rat
      if (RatBot.containsRat(message.content)) {
        // reply with the rat gif
        await this.sendMessage(
          "https://i.imgur.com/KqvqLg3.gif",
          message.channel
        );
      }

      if (RatBot.containsMonkey(message.content)) {
        // reply with the monkey gif
        await this.sendMessage(
          "https://media.tenor.com/eUOiCZiskd8AAAAC/monkey-spinning-holding-hands.gif",
          message.channel
        );
      }

      if (RatBot.containsGoblin(message.content)) {
        // reply with the goblin gif
        await this.sendMessage(
          "https://i.imgur.com/ZVyjxzN.gif",
          message.channel
        );
      }
    });

    this.login();
  }

  /**
   * Check if the message contains "rat"
   * @param message the message to check
   */
  static containsRat(message: string): boolean {
    return ratRegex.exec(message) != null;
  }

  /**
   * Check if the message contains some sort of monkey
   * @param message the message to check
   */
  static containsMonkey(message: string): boolean {
    return monkeyRegex.exec(message) != null;
  }

  /**
   * Check if the message contains some sort of goblin
   * @param message the message to check
   */
  static containsGoblin(message: string): boolean {
    return goblinRegex.exec(message) != null;
  }
}
