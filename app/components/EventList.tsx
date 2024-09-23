"use client";

import { useRef } from "react";
import Image from "next/image";

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

interface EventListProps {
  events: ProcessedEvent[];
}

export default function EventList({ events }: EventListProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const handleEventClick = (lon: string, lat: string) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [parseFloat(lon), parseFloat(lat)],
        zoom: 15,
      });
    }
  };

  return (
    <section className="rounded-xl border px-3 py-4 shadow-md shadow-blue-500/40">
      <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-white">
        Upcoming Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.slice(0, 5).map((event, index) => (
          <div
            key={index}
            className="w-full py-3 border-t border-b border-black border-opacity-10 flex flex-nowrap cursor-pointer hover:opacity-80"
            onClick={() => handleEventClick(event.lon, event.lat)}>
            <div className="w-1/4">
              <Image
                className="object-contain w-full rounded-xl overflow-hidden"
                src={event.featureImage}
                alt={event.title}
                width={100}
                height={100}
              />
            </div>
            <div className="w-3/4 px-2">
              <h1 className="text-xl font-bold font-pop text-white">
                {event.title}
              </h1>
              <h2 className="text-white">{event.venueNameData}</h2>
              <p className="text-white">{event.eventStartDay}</p>
              <p className="text-white">{event.eventStartTime || ""}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
