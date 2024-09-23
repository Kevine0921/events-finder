"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

// Don't forget to import the CSS
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

interface ProcessedEvent {
  lat: string;
  lon: string;
  title: string;
  url: string;
  venueNameData: string;
  featureImage: string;
  eventStartDay: string;
  eventStartTime: string;
}

interface MapComponentProps {
  events: ProcessedEvent[];
}

const mapBoxKey =
  "pk.eyJ1Ijoienp6YmlhIiwiYSI6ImNsM3ZubXB0djJuc2UzZGw4NHBscnltb3IifQ.DW29ynZDDnPeH6hmtl8O8g";

export default function MapComponent({ events }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng] = useState(-30);
  const [lat] = useState(40);
  const [zoom] = useState(2.5);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once

    const initializeMap = async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      (mapboxgl as any).accessToken = mapBoxKey;

      const newMap = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/zzzbia/cl3yk4t1e000h15s3i77cogqd",
        center: [lng, lat],
        zoom: zoom,
      });

      map.current = newMap;

      newMap.on("load", () => {
        // Add geocoder control
        const geocoder = new MapboxGeocoder({
          accessToken: mapBoxKey,
          mapboxgl: mapboxgl,
          zoom: 13,
          placeholder: "Enter an address or place name",
          bbox: [-180, -90, 180, 90],
        });

        newMap.addControl(geocoder, "top-left");

        // Add event markers
        events.forEach((event) => {
          const marker = new mapboxgl.Marker()
            .setLngLat([parseFloat(event.lon), parseFloat(event.lat)])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
                  <h3 class="text-sky-500 hover:text-sky-600 font-bold">${
                    event.title
                  }</h3>
                  <img class="rounded drop-shadow-md" src="${
                    event.featureImage
                  }" alt="${event.title}">
                  <p class="text-cyan-900 font-medium">Location: ${
                    event.venueNameData
                  }</p>
                  <p class="text-cyan-900 font-medium">Playing on: ${
                    event.eventStartDay
                  }</p>
                  <p class="text-cyan-900 font-medium">Start Time: ${
                    event.eventStartTime || ""
                  }</p>
                  <a class="border border-sky-600 text-l rounded-lg bg-sky-500 p-1 font-bold shadow-lg shadow-blue-500/40 hover:opacity-90 hover:text-white" href="${
                    event.url
                  }" target="_blank" rel="noopener noreferrer">Book Now</a>
                `)
            );

          marker.addTo(newMap);
        });
      });
    };

    initializeMap();

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [events, lng, lat, zoom]);

  return (
    <div ref={mapContainer} className="absolute top-0 bottom-0 w-full h-full" />
  );
}
