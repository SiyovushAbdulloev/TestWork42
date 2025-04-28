export interface ForecastCard {
  date: number;
  temp: { day: number; min: number; max: number };
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  sunrise: number;
  sunset: number;
}

export interface FavouriteCity {
  name: string
  lat: number
  lon: number
}
