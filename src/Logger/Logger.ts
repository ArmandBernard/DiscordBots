import { ILogger } from "./ILogger";

export class Logger implements ILogger {
  log(message: string) {
    console.log(message);
  }
  warn(message: string): void {
    console.warn(message);
  }
  error(message: string) {
    console.error(message);
  }
}
