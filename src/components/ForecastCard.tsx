// components/ForecastCard.tsx
import React from "react";
import {ForecastCard as ForecastCardI} from "@/types/weather";

interface ForecastCardProps {
  data: ForecastCardI;
}

const ForecastCard: React.FC<ForecastCardProps> = ({data}: ForecastCardProps) => {
  const {date, temp, description, icon, humidity, windSpeed, sunset, sunrise} = data
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
      <div className="card text-center mb-3 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{formatDate(date)}</h5>
          <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt="Weather Icon"
              width={80}
              height={80}
          />
          <p className="card-text text-capitalize">{description}</p>
          <p className="card-text">
            🌡️ {Math.round(temp.day)}°C <br />
            🔽 {Math.round(temp.min)}°C / 🔼 {Math.round(temp.max)}°C
          </p>
          <p className="card-text">
            💧 Humidity: {humidity}%<br />
            🌬️ Wind: {windSpeed} m/s
          </p>
          <p className="card-text">
            🌅 Sunrise: {formatTime(sunrise)} <br />
            🌇 Sunset: {formatTime(sunset)}
          </p>
        </div>
      </div>
  );
};

export default ForecastCard;
