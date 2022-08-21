import { RatBot } from "./RatBot";

const validExamples = ["rat", " rat ", "You are a rat.", "RAT"];
const invalidExamples = ["ratatouille"];

describe("ratBot's regex", () => {
  it("finds 'rat' in all valid examples", () => {
    validExamples.forEach((example) => {
      expect(RatBot.containsRat(example)).toBe(true);
    });
  });

  it("does not find rat any invalid examples", () => {
    invalidExamples.forEach((example) => {
      expect(!RatBot.containsRat(example)).toBe(true);
    });
  });
});
