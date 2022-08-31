import { WordCounter } from "./WordCounter";

const expectedParsedWords = [
  ["word", "word"],
  [" word ", "word"],
  [" multiple words ", "multiple words"],
  ["HQW£%U£J$%^J", "HQW£%U£J$%^J"],
];

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
  describe("request parser", () => {
    describe("correctly pulls intended words", () => {
      it.each(expectedParsedWords)("takes '%s' and returns '%s'", (a, b) => {
        expect(WordCounter.parseRequest(a)).toBe(b);
      });
    });
    it("removes all mentions", () => {
      expect(
        WordCounter.parseRequest("I think <@&1234> is better than <@&5678>")
      ).toBe("I think  is better than");
    });
  });
});
