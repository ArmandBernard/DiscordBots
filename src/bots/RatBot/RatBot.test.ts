import { RatBot } from "./RatBot";

const validRatExamples = [
  "[rat]",
  "[rats]",
  " [rat] ",
  "You are a [rat].",
  "[RAT]",
];
const invalidRatExamples = ["ratatouille", "drat"];

const validCatExamples = [
  "[cat]",
  "[cats]",
  " [chat] ",
  "Join the [chat].",
  "[CHAT]",
];
const invalidCatExamples = ["catastrophic", "catch"];

const validMonkeyExamples = [
  "[monkey]",
  "[monkey]s",
  " [gorilla] ",
  "You are an [ape].",
  "GO [APE]",
];
const invalidMonkeyExamples = ["grape"];

const validGoblinExamples = [
  "[goblin]",
  "[goblins]",
  " [fuling] ",
  "You are a [gremlin].",
  "[GOBLIN]",
];
const invalidGoblinExamples = ["GOBLINT"];

const validAubergineExamples = [
  "[aubergine]",
  "[AUBERGINES] ",
  "Nice [cock].",
  "[CUM]",
  "[eggplant]",
];
const invalidAubergineExamples = ["Cockerel"];

const validNightxamples = ["[night]", "[NIGHT] ", " [Tonight] "];
const invalidNightExamples = ["knight"];

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

  describe("finds aubergine in", () => {
    it.each(validAubergineExamples)("'%s'", (example) => {
      expect(RatBot.containsAubergine(example)).toBe(true);
    });
  });

  describe("does not find aubergine in", () => {
    it.each(invalidAubergineExamples)("'%s'", (example) => {
      expect(!RatBot.containsAubergine(example)).toBe(true);
    });
  });

  describe("finds night in", () => {
    it.each(validNightxamples)("'%s'", (example) => {
      expect(RatBot.containsNight(example)).toBe(true);
    });
  });

  describe("does not find night in", () => {
    it.each(invalidNightExamples)("'%s'", (example) => {
      expect(!RatBot.containsNight(example)).toBe(true);
    });
  });
});
