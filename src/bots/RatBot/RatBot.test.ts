import { RatBot } from "./RatBot";

const validRatExamples = ["rat", "rats", " rat ", "You are a rat.", "RAT"];
const invalidRatExamples = ["ratatouille", "drat"];

const validCatExamples = ["cat", "cats", " chat ", "Join the chat.", "CHAT"];
const invalidCatExamples = ["catastrophic", "catch"];

const validMonkeyExamples = [
  "monkey",
  "monkeys",
  " gorilla ",
  "You are an ape.",
  "GO APE",
];
const invalidMonkeyExamples = ["grape"];

const validGoblinExamples = [
  "goblin",
  "goblins",
  " fuling ",
  "You are a gremlin.",
  "GOBLIN",
];
const invalidGoblinExamples = ["GOBLINT"];

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

  describe("finds cat in", () => {
    it.each(validCatExamples)("'%s'", (example) => {
      expect(RatBot.containsCat(example)).toBe(true);
    });
  });

  describe("does not find cat in", () => {
    it.each(invalidCatExamples)("'%s'", (example) => {
      expect(!RatBot.containsCat(example)).toBe(true);
    });
  });

  describe("finds monkey in", () => {
    it.each(validMonkeyExamples)("'%s'", (example) => {
      expect(RatBot.containsMonkey(example)).toBe(true);
    });
  });

  describe("does not find monkey in", () => {
    it.each(invalidMonkeyExamples)("'%s'", (example) => {
      expect(!RatBot.containsMonkey(example)).toBe(true);
    });
  });

  describe("finds goblin in", () => {
    it.each(validGoblinExamples)("'%s'", (example) => {
      expect(RatBot.containsGoblin(example)).toBe(true);
    });
  });

  describe("does not find goblin in", () => {
    it.each(invalidGoblinExamples)("'%s'", (example) => {
      expect(!RatBot.containsGoblin(example)).toBe(true);
    });
  });
});
