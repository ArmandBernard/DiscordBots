import { ratBot } from "./ratBot";

const validExamples = ["rat", " rat ", "You are a rat.", "RAT"];
const invalidExamples = ["ratatouille"];

describe("ratBot's regex", () => {
  it("finds 'rat' in all valid examples", () => {
    validExamples.forEach((example) => {
      expect(ratBot.containsRat(example)).toBe(true);
    });
  });

  it("does not find rat any invalid examples", () => {
    invalidExamples.forEach((example) => {
      expect(!ratBot.containsRat(example)).toBe(true);
    });
  });
});
