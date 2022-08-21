import { WeatherBot } from "./WeatherBot";
import { MockLogger } from "../../Logger/MockLogger";

const invalidCityNames = ["", " ", "."];

const validPhrases = [
  ["Weather in London", "London"],
  ["weather in new york", "new york"],
  ["Weather in Memphis, Egypt", "Memphis, Egypt"],
  ["Weather in Memphis, Tennessee in fahrenheit", "Memphis, Tennessee"],
  ["weather in New York in fahrenheit", "New York"],
  ["I'd like the weather in New York. Thank you.", "New York"],
];

describe("WeatherBot", () => {
  describe("parseRequest", () => {
    it("will pull city for all valid phrases", () => {
      validPhrases.forEach((phrase) => {
        const request = WeatherBot.parseRequest(phrase[0], new MockLogger());

        expect(request.city).toBe(phrase[1]);
      });
    });

    it("will ignore invalid city names", () => {
      invalidCityNames.forEach((cityName) => {
        const request = WeatherBot.parseRequest(
          `weather in ${cityName}`,
          new MockLogger()
        );

        expect(request.city).toBeUndefined();
      });
    });

    it("will use fahrenheit when asked", () => {
      const cityName = "Paris";

      const request = WeatherBot.parseRequest(
        `weather in ${cityName} in fahrenheit`,
        new MockLogger()
      );

      expect(request.city).toBe(cityName);
      expect(request.useFahrenheit).toBe(true);
    });
  });
});
