"use client";
import { useState, useEffect } from "react";
import { Map } from "mapbox-gl";

interface Area {
  address: string;
  lon: number;
  lat: number;
}

const recommendedAreas: Area[] = [
  {
    address: "Scotiabank Arena",
    lon: -79.3791035,
    lat: 43.6433895,
  },
  {
    address: "Ontario Place",
    lon: -79.41511374999999,
    lat: 43.62939075,
  },
  {
    address: "Danforth Music Hall",
    lon: -79.357071,
    lat: 43.676338,
  },
];

export default function RecommendedAreas() {
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    // Initialize map here if needed
  }, []);

  const handleAreaClick = (lon: number, lat: number): void => {
    if (map) {
      map.flyTo({
        center: [lon, lat],
        zoom: 15,
      });
    }
  };

  return (
    <section className="my-3 rounded-xl border px-2 py-3 shadow-md shadow-blue-500/40">
      <h2 className="font-pop text-2xl lg:text-3xl font-bold text-white my-3">
        Recommended Areas
      </h2>
      <hr />
      <ul id="recommended-areas">
        {recommendedAreas.map((area: Area, index: number) => (
          <li
            key={index}
            className="text-xl cursor-pointer hover:text-cyan-700"
            onClick={() => handleAreaClick(area.lon, area.lat)}>
            {area.address}
          </li>
        ))}
      </ul>
    </section>
  );
}
