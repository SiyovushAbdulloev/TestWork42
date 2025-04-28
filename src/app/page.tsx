"use client"

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Spinner } from "react-bootstrap";
import styles from "@/styles/Home.module.scss";
import ForecastCard, {ForecastCard as ForecastI} from "@/components/ForecastCard";
import {useWeatherStore} from "@/app/store/store";

export default function Home() {
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentWeather, setCurrentWeather] = useState<ForecastI | null>(null);
  const [coordinates, setCoordinates] = useState<{ lon: number, lat: number } | null>(null);
  const {setFavoriteCity, favorite_cities} = useWeatherStore()

  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const { data } = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      setCoordinates(data.coord)
      setCurrentWeather({
          date: data.dt,
          temp: {
            day: data.main.temp,
            min: data.main.temp_min,
            max: data.main.temp_max,
          },
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
      })
    } catch (err) {
      console.log({err})
      setError("City not found or API error.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim() !== "") {
      fetchWeather();
    }
  };

  const onFavourite = () => {
    setIsFavoriteAdded(true)
    if (coordinates) {
      setFavoriteCity({
        name: city,
        lat: coordinates?.lat,
        lon: coordinates?.lon,
      })
    }
    setIsFavoriteAdded(false);
  }

  return (
      <div className={`container ${styles.home}`}>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="my-4">Weather App</h1>
          <Link href="/favourites" className="text-white">
            To favourites
          </Link>
        </div>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="input-group">
            <input
                type="text"
                className="form-control"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </div>
        </form>

        {loading && (
            <div className="text-center my-5">
              <Spinner animation="border"/>
            </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {currentWeather && coordinates && (
            <>
              <Link href={`/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}`}>
                <ForecastCard data={currentWeather} />
              </Link>

              <div className="d-flex justify-content-center mt-3">
                  {favorite_cities.find(c => c.lat === coordinates.lat && c.lon === coordinates.lon) ? (
                      <div className="text-success fw-bold">
                        🌟 Added
                      </div>
                      ) : (
                      <button onClick={onFavourite} className="btn btn-warning">
                        {isFavoriteAdded ? (
                            <Spinner animation="border"/>
                        ) : "Add to Favorites"}
                      </button>
                  )}
              </div>
            </>
        )}
      </div>
  );
}
