import { WordCounter } from "./WordCounter";

describe("WordCounter", () => {
  describe("regex for finding mentions", () => {
    it("finds a mention at the start", () => {
      const message = "<@&1014610397430550604> how are you doing?";

      expect(WordCounter.mentionsRegex.test(message)).toBe(true);
    });
    it("does not find a mention where there is none", () => {
      const message = "Totally normal message";

      expect(WordCounter.mentionsRegex.test(message)).toBe(false);
    });
    it("finds a mention even when it is surrounded by text", () => {
      const message = "I think <@&1014610397430550604>'s code is broken";

      expect(WordCounter.mentionsRegex.test(message)).toBe(true);
    });
  });
});
