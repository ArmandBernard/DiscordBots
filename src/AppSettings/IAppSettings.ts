/**
 * The expected shape of the applications settings file
 */
export interface IAppSettings {
  ratBot:
    | {
        token: string | undefined;
      }
    | undefined;
  weatherBot:
    | {
        token: string | undefined;
        weatherApiToken: string | undefined;
      }
    | undefined;
  wordCounter:
    | {
        token: string | undefined;
      }
    | undefined;
}
