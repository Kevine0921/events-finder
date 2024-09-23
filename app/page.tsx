"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import RecommendedAreas from "./components/RecommendedAreas";
import PastSearches from "./components/PastSearches";
import EventList from "./components/EventList";
import { useEvents } from "./hooks/useEvents";

const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
});

export default function Home() {
  const events = useEvents();

  // useEffect(() => {
  //   // Fetch events data here
  //   // setEvents(fetchedEvents)
  // }, []);

  return (
    <main>
      <div className="flex flex-row w-full flex-wrap-reverse lg:flex-nowrap text-white">
        <div className="lg:flex-1 w-full lg:w-64 flex-shrink-0 px-2">
          <RecommendedAreas />
          <PastSearches />
        </div>

        <div className="flex-1 min-w-[300px] w-[100vw]  max-h-[30vh] lg:max-h-[60vh] lg:w-auto overflow-hidden h-[90vh] rounded-lg relative top-0 lg:top-10 self-start">
          <MapComponent events={events} />
        </div>
      </div>

      <div>
        <Image
          src="/assets/images/pexels-luis-ruiz-1292843.jpg"
          className="drop-shadow-lg flex flex-col md:flex-row rounded-lg w-full h-auto"
          alt="Toronto by Luis Ruiz"
          width={1200}
          height={800}
        />
        <EventList events={events} />
      </div>
    </main>
  );
}
