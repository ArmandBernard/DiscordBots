import { RatBot } from "./RatBot";

const validExamples = ["rat", " rat ", "You are a rat.", "RAT"];
const invalidExamples = ["ratatouille", "drat"];

describe("RatBot's regex", () => {
  describe("finds 'rat' in", () => {
    it.each(validExamples)("'%s'", (example) => {
      expect(RatBot.containsRat(example)).toBe(true);
    });
  });

  describe("does not find rat in", () => {
    it.each(invalidExamples)("'%s'", (example) => {
      expect(!RatBot.containsRat(example)).toBe(true);
    });
  });
});
