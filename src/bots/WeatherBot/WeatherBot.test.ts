import { WeatherBot } from "./WeatherBot";
import { ILogger } from "../../Logger/ILogger";

const invalidCityNames = ["", " ", "."];

const validPhrases = [
  ["Weather in London", "London"],
  ["weather in new york", "new york"],
  ["weather in New York in fahrenheit", "New York"],
  ["I'd like the weather in New York, thanks.", "New York"],
];

const mockLogger = { warn: () => undefined } as unknown as ILogger;

describe("WeatherBot", () => {
  describe("parseRequest", () => {
    it("will pull city for all valid phrases", () => {
      validPhrases.forEach((phrase) => {
        const request = WeatherBot.parseRequest(phrase[0], mockLogger);

        expect(request.city).toBe(phrase[1]);
      });
    });

    it("will ignore invalid city names", () => {
      invalidCityNames.forEach((cityName) => {
        const request = WeatherBot.parseRequest(
          `weather in ${cityName}`,
          mockLogger
        );

        expect(request.city).toBeUndefined();
      });
    });

    it("will use fahrenheit when asked", () => {
      const cityName = "Paris";

      const request = WeatherBot.parseRequest(
        `weather in ${cityName} in fahrenheit`,
        mockLogger
      );

      expect(request.city).toBe(cityName);
      expect(request.useFahrenheit).toBe(true);
    });
  });
});
