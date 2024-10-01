"use client";
import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import { fetchEvents, getEvents } from "../api/fetchdata";

interface Venue {
  name: string;
  location: {
    latitude: string;
    longitude: string;
  };
  city: {
    name: string;
  };
}

interface Image {
  ratio: string;
  url: string;
  width: number;
  height: number;
  fallback: boolean;
}

interface TicketmasterEvent {
  id: string;
  name: string;
  url: string;
  dates: {
    start: {
      localDate: string;
      localTime: string;
    };
    status: {
      code: string;
    };
    timezone: string;
  };
  info: string;
  priceRanges: Array<{
    type: string;
    currency: string;
    min: number;
    max: number;
  }>;
  _embedded: {
    venues: Venue[];
  };
  images: Image[];
}

interface ProcessedEvent {
  lat: string;
  lon: string;
  id: string;
  title: string;
  url: string;
  info: string;
  venueNameData: string;
  city: string;
  featureImage: string;
  eventStartDay: string;
  eventStartTime: string;
  eventTimeZone: string;
}

interface PaginationInfo {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

function getLargestImage(images: Image[]): string {
  return images.reduce((largest, current) => {
    return current.width * current.height > largest.width * largest.height
      ? current
      : largest;
  }).url;
}

export function useEvents() {
  const [events, setEvents] = useState<ProcessedEvent[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  const getAllEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEvents();

      const currentDate = moment().format("YYYY-MM-DD");
      const startWeekDate = moment().subtract(1, "days").format("YYYY-MM-DD");
      const endWeekDate = moment().add(15, "days").format("YYYY-MM-DD");

      const filteredEvents = data
        .filter((event: TicketmasterEvent) => {
          const dateData = event.dates.start.localDate;
          const dateCheck = moment(dateData).isBetween(
            startWeekDate,
            endWeekDate
          );
          const cancelledCheck = event.dates.status.code;
          return dateCheck && cancelledCheck === "onsale";
        })
        .map(
          (event: TicketmasterEvent): ProcessedEvent => ({
            lat: event._embedded?.venues[0]?.location?.latitude,
            lon: event._embedded?.venues[0]?.location?.longitude,
            id: event.id,
            info: event.info,
            title: event.name,
            url: event.url,
            venueNameData: event._embedded?.venues[0]?.name,
            city: event._embedded?.venues[0]?.city?.name,
            featureImage: getLargestImage(event.images),
            eventStartDay: event.dates.start.localDate,
            eventStartTime: event.dates.start.localTime,
            eventTimeZone: event.dates.timezone,
          })
        );

      setEvents(filteredEvents);
      // setPaginationInfo(data.pagination);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  return { events, paginationInfo, loading };
}
