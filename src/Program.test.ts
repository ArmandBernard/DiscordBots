import { readFileSync } from "fs";
import { Program } from "./Program";
import { MockLogger } from "./Logger/MockLogger";

jest.mock("fs");

describe("In index.ts", () => {
  describe("loadConfig", () => {
    it("should return parse and return valid settings", () => {
      const token = "ratToken";
      const mockSettingsJson = `{
            "ratBot": {
                "token": "${token}"
            }
        }`;

      // create mock of readFileSync;
      const mockedRead = jest.mocked(readFileSync, true);
      mockedRead.mockReturnValue(mockSettingsJson);

      const settings = Program.loadSettings(new MockLogger());

      expect(settings?.ratBot?.token).toBe(token);
    });

    it("should log error when run on invalid json", () => {
      // create mock of readFileSync;
      const mockedRead = jest.mocked(readFileSync, true);
      mockedRead.mockReturnValue("what?");

      // create a logger mock
      const loggerMock = new MockLogger();

      // spy on the error call
      const spy = jest.spyOn(loggerMock, "error");

      const settings = Program.loadSettings(loggerMock);

      expect(settings).toBeUndefined();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith("failed to parse appSettings.json");
    });
  });
});
