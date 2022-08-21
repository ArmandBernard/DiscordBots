export const apiUrl = "https://api.weatherapi.com/v1";

export interface ApiResponse {
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
