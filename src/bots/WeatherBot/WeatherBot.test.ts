import { WeatherBot } from "./WeatherBot";
import { MockLogger } from "../../Logger/MockLogger";
import { ApiErrorResponse } from "./WeatherApi";

const invalidCityNames = ["", " ", "."];

const validPhrases = [
  ["Weather in London", "London"],
  ["weather in new york", "new york"],
  ["weather in New York in fahrenheit", "New York"],
  ["I'd like the weather in New York, thanks.", "New York"],
];

describe("WeatherBot", () => {
  describe("parseRequest", () => {
    describe("will pull city for all valid phrases", () => {
      it.each(validPhrases)(
        "'%s' finds city '%s'",
        (phrase: string, expectedCity: string) => {
          const request = WeatherBot.parseRequest(phrase, new MockLogger());

          expect(request.city).toBe(expectedCity);
        }
      );
    });

    describe("will ignore invalid city names", () => {
      it.each(invalidCityNames)("'%s' is invalid", (invalidName) => {
        const request = WeatherBot.parseRequest(
          `weather in ${invalidName}`,
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
  describe("composeReply", () => {
    it("can handle place not found errors", () => {
      const request = { city: "Somewhere", useFahrenheit: false };

      const response: ApiErrorResponse = {
        error: {
          code: 1006,
          message: "The place wasn't found :(",
        },
      };

      const reply = WeatherBot.composeReply(request, response);

      expect(reply).toContain("I don't know where that is.");
    });
    it("can handle random errors", () => {
      const request = { city: "Somewhere", useFahrenheit: false };

      const response: ApiErrorResponse = {
        error: {
          code: 1000,
          message: "This is a random error",
        },
      };

      const reply = WeatherBot.composeReply(request, response);

      expect(reply).toContain(response.error.message);
    });
  });
});
