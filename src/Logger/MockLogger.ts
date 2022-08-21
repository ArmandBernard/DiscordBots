import { ILogger } from "./ILogger";

export class MockLogger implements ILogger {
  log = () => undefined;
  warn = () => undefined;
  error = () => undefined;
}
