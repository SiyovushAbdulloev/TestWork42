import {create} from "zustand";

interface FavoriteCity {
  name: string
  lat: number
  lon: number
}

interface WeatherState {
  favorite_cities: FavoriteCity[]
  setFavoriteCity: (favoriteCity: FavoriteCity) => void
}

export const useWeatherStore = create<WeatherState>((set) => ({
  favorite_cities: typeof window !== "undefined" ? JSON.parse(localStorage.getItem('favorite_cities') || "[]") : [],
  setFavoriteCity: (city: FavoriteCity) => set((state) => {
    let newState = state.favorite_cities
    if (state.favorite_cities.find(c => c.lat === city.lat && c.lon === city.lon)) {
      newState = state.favorite_cities.filter(c => c.lat !== city.lat && c.lon !== city.lon);
    } else {
      newState = [...state.favorite_cities, city];
    }
    localStorage.setItem('favorite_cities', JSON.stringify(newState));
    return {...state, favorite_cities: newState};
  })
}))
