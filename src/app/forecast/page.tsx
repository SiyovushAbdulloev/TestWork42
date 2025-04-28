"use client"

import axios from "axios";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import ForecastCard, {ForecastCard as ForecastCardI} from "@/components/ForecastCard";
import Link from "next/link";
import {Spinner} from "react-bootstrap";

export default function Day() {
  const searchParams = useSearchParams();
  const lon = searchParams.get('lon')
  const lat = searchParams.get('lat')
  const [forecast, setForecast] = useState<ForecastCardI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!lon && !lat) return;

    const fetchForecast = async () => {
      setLoading(true);
      setError("");
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        const response = await axios.get(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}`
        );

        setForecast(response.data.daily.map((day: any) => ({
          date: day.dt,
          temp: day.temp,
          description: day.weather[0].description,
          icon: day.weather[0].icon,
          humidity: day.humidity,
          windSpeed: day.wind_speed,
          sunrise: day.sunrise,
          sunset: day.sunset,
        })));
      } catch (err) {
        setError("Failed to fetch forecast.");
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [lat, lon]);

  if (!lon && !lat) {
    return (
        <div className="container my-5 text-center">
          <h2>Please search for a city first</h2>
          <Link href="/" className="btn btn-primary mt-3">Go Home</Link>
        </div>
    );
  }

  return (
      <div className="container pb-5">
        <h1 className="text-center mb-4 pt-5">5-Day Forecast</h1>

        {loading && (
            <div className="d-flex justify-content-center my-5">
              <Spinner animation="border" />
            </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          {forecast.map((item) => (
              <div className="col-md-4 mb-4" key={item.date}>
                <ForecastCard
                    data={item}
                />
              </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="btn btn-secondary">← Back</Link>
        </div>
      </div>
  );
}
