import { ILogger } from "./ILogger";

export class Logger implements ILogger {
  log(message: string) {
    console.log(this.constructString("INFO", message));
  }
  warn(message: string): void {
    console.warn(this.constructString("WARN", message));
  }
  error(message: string) {
    console.error(this.constructString("ERROR", message));
  }

  constructString(level: "INFO" | "WARN" | "ERROR", message: string) {
    return `[${level}][${new Date().toISOString()}] ${message}`;
  }
}
