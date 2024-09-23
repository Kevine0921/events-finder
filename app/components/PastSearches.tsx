"use client";

import { useState, useEffect } from "react";

export default function PastSearches() {
  const [pastSearches, setPastSearches] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const storedSearches = JSON.parse(
      localStorage.getItem("pastSearches") || "[]"
    );
    setPastSearches(storedSearches);
    // Initialize map here if needed
  }, []);

  const handleSearchClick = (lon, lat) => {
    if (map) {
      map.flyTo({
        center: [lon, lat],
      });
    }
  };

  const clearPastSearches = () => {
    localStorage.removeItem("pastSearches");
    setPastSearches([]);
  };

  return (
    <section
      id="past-search-container"
      className="my-3 rounded-xl border px-2 py-3 shadow-md shadow-blue-500/40">
      <div className="flex flex-row space-between min-w-full">
        <div className="flex-grow-1 flex-1">
          <h2 className="font-pop text-2xl lg:text-3xl font-bold text-white">
            Past Searches
          </h2>
          <hr />
        </div>
        <div className="flex justify-end align-center" id="clear-past-searches">
          {pastSearches.length > 0 && (
            <span
              id="clear-btn"
              className="mx-auto my-auto cursor-pointer group"
              onClick={clearPastSearches}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-[#3A485F] group-hover:fill-red-400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <rect
                  x="15.7427"
                  y="6.55029"
                  width="1"
                  height="13"
                  transform="rotate(45 15.7427 6.55029)"
                />
                <rect
                  x="16.4497"
                  y="15.7427"
                  width="1"
                  height="13"
                  transform="rotate(135 16.4497 15.7427)"
                />
              </svg>
            </span>
          )}
        </div>
      </div>
      <div id="previous-searches" className="flex flex-col">
        {pastSearches.map((search, index) => (
          <h3
            key={index}
            className="text-xl cursor-pointer hover:text-cyan-700"
            onClick={() => handleSearchClick(search.lon, search.lat)}>
            {search.address}
          </h3>
        ))}
      </div>
    </section>
  );
}
