"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import RecommendedAreas from "./components/RecommendedAreas";
import EventList from "./components/EventList";
import { useEvents } from "./hooks/useEvents";

const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
});

export default function Home() {
  const events = useEvents();

  return (
    <main>
      <div className="flex flex-row w-full flex-wrap-reverse lg:flex-nowrap text-white">
        <div className="lg:flex-1 w-full lg:w-64 flex-shrink-0 px-2">
          <RecommendedAreas />
        </div>

        <div className="flex-1 min-w-[300px] w-[100vw]  max-h-[30vh] lg:max-h-[60vh] lg:w-auto overflow-hidden h-[90vh] rounded-lg relative top-0 lg:top-10 self-start">
          <MapComponent events={events} />
        </div>
      </div>

      <div>
        =======================================================
        <EventList events={events} />
      </div>
    </main>
  );
}
