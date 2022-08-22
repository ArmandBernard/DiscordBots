export const apiUrl = "https://api.weatherapi.com/v1";

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

interface ApiErrorResponse {
  error: ApiError;
}

// type guard for error response
// (see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
export const isApiErrorResponse = (
  apiResponse: ApiResponse
): apiResponse is ApiErrorResponse => {
  return (apiResponse as ApiErrorResponse).error !== undefined;
};

interface ApiError {
  code: number;
  message: string;
}

interface ApiSuccessResponse {
  location: ApiLocation;
  current: CurrentWeather;
}

interface ApiLocation {
  name: string;
  region: string;
  country: string;
  localTime: string;
}

interface CurrentWeather {
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  condition: Condition;
}

interface Condition {
  text: string;
}
