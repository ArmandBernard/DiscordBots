import { GatewayIntentBits, IntentsBitField } from "discord.js";
import { ILogger } from "../../ILogger";
import { BotBase } from "../BotBase";
import fetch from "cross-fetch";
import { ApiResponse, apiUrl } from "./WeatherApi";

const intents: GatewayIntentBits[] = [
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
];

const lookForWeatherRegex = /\bweather\b/i;

// Use https://regexr.com/ to try this out!
const getCityRegex =
  /\bweather in ((?:[\w]+? ?)+?)(?:(in fahrenheit)|[^\w ]|$)/im;

interface WeatherBotProps {
  /**
   * The token the bot will use to log in
   */
  token: string;
  weatherKey: string;
  /**
   * The logger the bot will use to log messages
   */
  logger: ILogger;
}

export class WeatherBot extends BotBase {
  weatherKey: string;

  constructor(props: WeatherBotProps) {
    super({
      ...props,
      name: "weatherBot",
      intents,
    });

    this.weatherKey = props.weatherKey;

    // when a message is created
    this.client.on("messageCreate", async (message) => {
      if (!WeatherBot.containsWeather(message.content)) {
        return;
      }

      const result = await WeatherBot.callApi(this.weatherKey);

      const name = result.location.name;
      const temp = result.current.temp_c;

      const messageToSend = `In ${name}, the temperature is ${temp}°C`;

      message.channel.send(messageToSend);
    });

    this.login();
  }

  static async callApi(weatherKey: string): Promise<ApiResponse> {
    const url = `${apiUrl}/current.json?key=${weatherKey}&q=London`;

    const response = await fetch(url);

    return response.json() as Promise<ApiResponse>;
  }

  /**
   * Check if the message contains "weather"
   * @param message the message to check
   * @returns true if the message contains "weather"
   */
  static containsWeather(message: string): boolean {
    return lookForWeatherRegex.exec(message) != null;
  }

  /**
   * Check if the message contains "weather"
   * @param message the message to check
   * @returns true if the message contains "weather"
   */
  static parseRequest(message: string): Request {
    const regexResult = getCityRegex.exec(message);
    const city = regexResult && regexResult[1].trimEnd();

    const useFahrenheit = message.includes("fahrenheit");

    return {
      city: city ?? undefined,
      useFahrenheit,
    };
  }
}

interface Request {
  city: string | undefined;
  useFahrenheit: boolean;
}
