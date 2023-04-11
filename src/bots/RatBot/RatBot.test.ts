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

const validGoblinExamples = [
  "goblin",
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
