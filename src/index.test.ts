import { readFileSync } from "fs";
import { Program } from ".";
import { ILogger } from "./ILogger";

jest.mock("fs");
jest.mock("./Logger");

describe("In index.ts", () => {
  describe("loadConfig", () => {
    it("should return parse and return valid settings", () => {
      const token = "ratToken";
      const mockSettingsJson = `{
            "botTokens": {
                "ratBot": "${token}"
            }
        }`;

      // create mock of readFileSync;
      const mockedRead = jest.mocked(readFileSync, true);
      mockedRead.mockReturnValue(mockSettingsJson);

      // create a logger mock
      const loggerMock = {} as unknown as ILogger;

      const settings = Program.loadSettings(loggerMock);

      expect(settings?.botTokens?.ratBot).toBe(token);
    });

    it("should log error when run on invalid json", () => {
      // create mock of readFileSync;
      const mockedRead = jest.mocked(readFileSync, true);
      mockedRead.mockReturnValue("what?");

      // create a logger mock
      const loggerMock = {
        error: () => undefined,
      } as unknown as ILogger;

      // spy on the error call
      const spy = jest.spyOn(loggerMock, "error");

      const settings = Program.loadSettings(loggerMock);

      expect(settings).toBeUndefined();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith("failed to parse appSettings.json");
    });
  });
});
