"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import moment from "moment";
import axios from "axios";
import { getLumaEvents } from "../../util/getlumaevent";
import { getMeetupEvents } from "../../util/getmeetupevent";
import { Slice } from "lucide-react";

const EventsContext = createContext();

function getLargestImage(images) {
  return images.reduce((largest, current) => {
    return current.width * current.height > largest.width * largest.height
      ? current
      : largest;
  }).url;
}

const fetchWeb3event = async () => {
  const data = {
    pages: 0,
    page_size: 0,
    status: 1,
    time: "",
    time_to: "",
    type: 1,
  };
  try {
    const result = await axios.post(`/api/explore`, data);
    return result.data.data;
  } catch (error) {
    console.error("Error fetching web3event data list:", error);
    throw error;
  }
};

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllEvents = useCallback(async () => {
    setLoading(true);
    try {
      // Check if we have cached data
      const cachedEvents = localStorage.getItem("cachedEvents");
      const cachedTimestamp = localStorage.getItem("cachedTimestamp");

      // If we have cached data and it's less than 1 hour old, use it
      if (
        cachedEvents &&
        cachedTimestamp &&
        Date.now() - parseInt(cachedTimestamp) < 360000
      ) {
        setEvents(JSON.parse(cachedEvents));
        setLoading(false);
        return;
      }

      // Fetch ticket events
      const response = await fetch("/api/explore");
      const ticketData = await response.json();

      const currentDate = moment().format("YYYY-MM-DD");
      const startWeekDate = moment().subtract(1, "days").format("YYYY-MM-DD");
      const endWeekDate = moment().add(15, "days").format("YYYY-MM-DD");

      const filteredTicketEvents = ticketData.events
        .filter((event) => {
          const dateData = event.dates.start.localDate;
          const dateCheck = moment(dateData).isBetween(
            startWeekDate,
            endWeekDate
          );
          const cancelledCheck = event.dates.status.code;
          return dateCheck && cancelledCheck === "onsale";
        })
        .map((event) => ({
          id: event.id,
          title: event.name,
          url: event.url,
          venueNameData: event._embedded?.venues[0]?.name,
          city: event._embedded?.venues[0]?.city?.name,
          featureImage: getLargestImage(event.images),
          eventTimeZone: event.dates.timezone,
          date: event?.dates?.start?.localDate,
          eventType: "TicketMaster",
        }));

      console.log(
        "==========filteredTicketEvents==",
        filteredTicketEvents.slice(0, 2)
      );
      // Fetch web3 events
      const web3Data = await fetchWeb3event();
      console.log("==========web3 sample==", web3Data.slice(0, 2));
      const filteredWeb3Events = web3Data.map((event) => ({
        id: event.id,
        title: event.title,
        url: `https://www.web3event.org/event/${event.id}`,
        venueNameData: event.addr,
        city: event?.city_name,
        featureImage: event?.image,
        eventTimeZone: event?.timezone,
        date: event?.start_time
          ? moment(event.start_time).format("YYYY-MM-DD")
          : null,
        eventType: "Web3event",
      }));
      console.log(
        "==========filteredWeb3Events==",
        filteredWeb3Events.slice(0, 2)
      );
      const lumaEvents = await getLumaEvents();
      const filteredLumaEvents = lumaEvents.map((event) => ({
        id: event.api_id,
        title: event.name,
        url: `https://lu.ma/${event.url}`,
        venueNameData: event.full_address,
        city: event.city,
        featureImage: event.cover_url,
        eventTimeZone: event.timezone,
        date: event?.start_at,
        eventType: "Luma",
      }));

      console.log(
        "==========filteredLumaEvents==",
        filteredWeb3Events.slice(0, 2)
      );

      const meetupEvents = await getMeetupEvents();
      const filteredmeetupEvents = meetupEvents.map((event) => ({
        id: event?.id,
        title: event?.name,
        url: event?.url,
        venueNameData: event?.group_name,
        city: event?.city,
        featureImage: event?.image_url,
        eventTimeZone: event?.timezone,
        date: event?.date ? moment(event.date).format("YYYY-MM-DD") : null,
        eventType: "Meetup",
      }));
      // Combine events
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

      const combinedEvents = shuffleArray([
        ...filteredTicketEvents,
        ...filteredWeb3Events,
        ...filteredLumaEvents,
        ...filteredmeetupEvents,
      ]);

      // Cache the events and timestamp
      localStorage.setItem("cachedEvents", JSON.stringify(combinedEvents));
      localStorage.setItem("cachedTimestamp", Date.now().toString());

      setEvents(combinedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  return (
    <EventsContext.Provider
      value={{ events, loading, refreshEvents: getAllEvents }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};
