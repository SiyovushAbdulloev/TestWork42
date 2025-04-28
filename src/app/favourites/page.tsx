"use client";

import Link from "next/link";
import {useEffect, useState} from "react";

interface FavoriteCity {
  name: string;
  lat: number;
  lon: number;
}

export default function Favourites() {
  const [favourites, setFavourites] = useState<FavoriteCity[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorite_cities');
    if (storedFavorites) {
      setFavourites(JSON.parse(storedFavorites));
    }
  }, []);

  if (!favourites.length) {
    return (
        <div className="container my-5 text-center">
          <h2>No favorites added yet!</h2>
          <Link href="/" className="btn btn-primary mt-3">
            Search City
          </Link>
        </div>
    );
  }

  return (
      <div className="container py-5">
        <h1 className="text-center mb-4">My Favorite Cities</h1>

        <div className="row">
          {favourites.map((city) => (
              <div className="col-md-4 mb-4" key={city.name}>
                <div className="card text-center shadow-sm p-3 h-100">
                  <h5 className="card-title">{city.name}</h5>
                  <div className="card-body d-flex flex-column">
                    <Link
                        href={`/forecast?lat=${city.lat}&lon=${city.lon}`}
                        className="btn btn-success mt-auto"
                    >
                      View Forecast
                    </Link>
                  </div>
                </div>
              </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="btn btn-secondary">
            ← Back to Search
          </Link>
        </div>
      </div>
  );
}
