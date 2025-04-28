"use client"

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Spinner } from "react-bootstrap";
import styles from "@/styles/Home.module.scss";
import ForecastCard, {ForecastCard as ForecastI} from "@/components/ForecastCard";

export default function Home() {
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [weather, setWeather] = useState<ForecastI[]>([]);

  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const { data } = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      const { lat, lon } = data.coord;

      const response = await axios.get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}`
      );

      setCity('')

      console.log({response})

      setWeather(response.data.daily.map((day: any) => ({
        date: day.dt,
        temp: day.temp,
        description: day.weather[0].description,
        icon: day.weather[0].icon,
        humidity: day.humidity,
        windSpeed: day.wind_speed,
        sunrise: day.sunrise,
        sunset: day.sunset,
      })))
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

  return (
      <div className={`container ${styles.home}`}>
        <h1 className="my-4">Weather App</h1>

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

        {weather.length ? (
            <div className="d-flex gap-3 flex-wrap">
              {weather.map(item => (
                  <ForecastCard
                      key={item.date}
                      data={item}
                  />
              ))}
            </div>
        ) : null}
      </div>
  );
}
