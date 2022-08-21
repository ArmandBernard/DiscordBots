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
      id: "1010629365555531846",
      intents,
    });

    this.weatherKey = props.weatherKey;

    // when a message is created
    this.client.on("messageCreate", async (message) => {
      if (!WeatherBot.containsWeather(message.content)) {
        return;
      }

      const result = await WeatherBot.callApi(this.weatherKey);

      const request = WeatherBot.parseRequest(message.content, this.logger);

      message.channel.send(WeatherBot.ComposeReply(request, result));
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
  static parseRequest(message: string, logger: ILogger): WeatherRequest {
    const regexResult = getCityRegex.exec(message);
    const city = regexResult && regexResult[1].trimEnd();

    if (!city) {
      logger.warn("failed to parse the following weather message:\n");
    }

    const useFahrenheit = (regexResult && regexResult[2]) !== undefined;

    return {
      city: city ?? undefined,
      useFahrenheit,
    };
  }

  static ComposeReply(request: WeatherRequest, data: ApiResponse): string {
    if (!request.city) {
      return `Please format your request like this:
"Weather in <cityname>( in fahrenheit)"
`;
    }

    const { location, current: weather } = data;

    const temp: string = request.useFahrenheit
      ? weather.temp_f + "°F"
      : weather.temp_c + "°C";
    const feelsLike: string = request.useFahrenheit
      ? weather.feelslike_f + "°F"
      : weather.feelslike_c + "°C";

    return `The weather in ${location.name}, ${location.country} is:
${weather["condition:text"]}
${temp} (feels like ${feelsLike})
    `;
  }
}

interface WeatherRequest {
  city: string | undefined;
  useFahrenheit: boolean;
}
