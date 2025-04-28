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
  const [currentWeather, setCurrentWeather] = useState<ForecastI | null>(null);
  const [coordinates, setCoordinates] = useState<{ lon: number, lat: number } | null>(null);

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
            day: 234234234234,
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
      setCity('')
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

        {currentWeather && (
            <Link href={`/forecast?lat=${coordinates?.lat}&lon=${coordinates?.lon}`}>
              <ForecastCard
                  data={currentWeather}
              />
            </Link>
        )}
      </div>
  );
}
