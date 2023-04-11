import { RatBot } from "./RatBot";

const validRatExamples = ["rat", " rat ", "You are a rat.", "RAT"];
const invalidRatExamples = ["ratatouille", "drat"];

const validMonkeyExamples = [
  "monkey",
  " gorilla ",
  "You are an ape.",
  "GO APE",
];
const invalidMonkeyExamples = ["grape"];

describe("RatBot's regex", () => {
  describe("finds 'rat' in", () => {
    it.each(validRatExamples)("'%s'", (example) => {
      expect(RatBot.containsRat(example)).toBe(true);
    });
  });

  describe("does not find rat in", () => {
    it.each(invalidRatExamples)("'%s'", (example) => {
      expect(!RatBot.containsRat(example)).toBe(true);
    });
  });

  describe("finds monkey in", () => {
    it.each(validMonkeyExamples)("'%s'", (example) => {
      expect(RatBot.containsMonkey(example)).toBe(true);
    });
  });

  describe("does not find monkey in", () => {
    it.each(invalidMonkeyExamples)("'%s'", (example) => {
      expect(RatBot.containsMonkey(example)).toBe(true);
    });
  });
});
