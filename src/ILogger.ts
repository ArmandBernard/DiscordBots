export interface ILogger {
  /**
   * Log an info-level message
   * @param message
   */
  log(message: string): void;
  /**
   * log an error-level message
   * @param message
   */
  error(message: string): void;
}
