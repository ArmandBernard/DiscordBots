import fs from "fs";
import { Program } from "./Program";
import { MockLogger } from "./Logger/MockLogger";

jest.mock("fs", () => ({
  promises: {
    readFile: () => undefined,
  },
}));

describe("loadConfig", () => {
  it("should return parse and return valid settings", async () => {
    const token = "ratToken";
    const mockSettingsJson = `{
          "ratBot": {
              "token": "${token}"
          }
      }`;

    // mock async readFile;
    const mockedRead = jest.spyOn(fs.promises, "readFile");
    mockedRead.mockReturnValue(Promise.resolve(mockSettingsJson));

    const settings = await Program.loadSettings(new MockLogger());

    expect(settings?.ratBot?.token).toBe(token);
  });

  it("should log error when run on invalid json", async () => {
    // mock async readFile;
    const mockedRead = jest.spyOn(fs.promises, "readFile");
    mockedRead.mockReturnValue(Promise.resolve("what?"));

    // create a logger mock
    const loggerMock = new MockLogger();

    // spy on the error call
    const spy = jest.spyOn(loggerMock, "error");

    const settings = await Program.loadSettings(loggerMock);

    expect(settings).toBeUndefined();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith("failed to parse appSettings.json");
  });
});
