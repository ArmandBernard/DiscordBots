import { Message } from "discord.js";
import { WordCounter } from "./WordCounter";

const expectedParsedWords = [
  ["word", "word"],
  [" word ", "word"],
  [" multiple words ", "multiple words"],
  ["HQW£%U£J$%^J", "HQW£%U£J$%^J"],
];

const makeMsg = (content: string): Message => {
  return { content } as Message;
};

const messageParserCases: [string, string, boolean, string][] = [
  ["Hi, how are you?", "are", true, "it's a full word"],
  ["Hi, how are you?", "Hi,", true, "it includes a valid comma"],
  ["Hi, how are you?", "ou", false, "it's not a complete word"],
  ["Hi, how are you?", "HOW", true, "it should not be case sensitive"],
  ["Hi, how are you?", "how are", true, "it should handle multiple words"],
  [
    "Hi, how are you?",
    "you?",
    true,
    "it should handle regex characters (requires escaping)",
  ],
];

describe("WordCounter", () => {
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
  describe("message parser", () => {
    it.each(messageParserCases)(
      "When given '%s' and looking for '%s', it returns '%s' because %s.",
      (message, search, expectedResult) => {
        expect(WordCounter.checkMessage(makeMsg(message), search)).toBe(
          expectedResult
        );
      }
    );
  });
});
