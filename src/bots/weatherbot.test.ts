import { WeatherBot } from "./weatherBot";

const validSingleWordCityNames = ["Paris", "london", "Delhi"];
const validMultiWordCityNames = ["New York", "Las Vegas"];

const invalidCityNames = ["", " ", "."];

const validPhrases = [
  ["weather in London", "London"],
  ["weather in New York", "New York"],
  ["weather in New York in fahrenheit", "New York"],
  ["I'd like the weather in New York, thanks.", "New York"],
];

describe("WeatherBot", () => {
  describe("parseRequest", () => {
    it("will pull all the a single word cities successfully", () => {
      validSingleWordCityNames.forEach((cityName) => {
        const request = WeatherBot.parseRequest(`weather in ${cityName}`);

        expect(request.city).toBe(cityName);
      });
    });

    it("will pull all the a multi-word cities successfully", () => {
      validMultiWordCityNames.forEach((cityName) => {
        const request = WeatherBot.parseRequest(`weather in ${cityName}`);

        expect(request.city).toBe(cityName);
      });
    });

    it("will ignore invalid city names", () => {
      invalidCityNames.forEach((cityName) => {
        const request = WeatherBot.parseRequest(`weather in ${cityName}`);

        expect(request.city).toBeUndefined();
      });
    });

    it("will use fahrenheit when asked", () => {
      const cityName = "Paris";

      const request = WeatherBot.parseRequest(
        `weather in ${cityName} in fahrenheit`
      );

      expect(request.city).toBe(cityName);
      expect(request.useFahrenheit).toBe(true);
    });

    it("will have a regex match for all valid phrases", () => {
      validPhrases.forEach((phrase) => {
        const request = WeatherBot.parseRequest(phrase[0]);

        expect(request.city).toBe(phrase[1]);
      });
    });
  });
});
