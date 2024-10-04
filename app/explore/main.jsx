"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/app/components/card";
import { LoadingComponent } from "@/app/components/loading";
import Image from "next/image";
import Link from "next/link";
import { useEvents } from "../hooks/useEvents";
import { AutoComplete, Input, Button } from "antd";
import { fetchWeb3event } from "../api/fetchdata";
import axios from "axios";

export const MainPage = () => {
  const { events, loading } = useEvents();
  const [web3Data, setWeb3Data] = useState([]);

  const [filteredEvents, setFilteredEvents] = useState(events);
  const [titleSearchTerm, setTitleSearchTerm] = useState("");
  const [citySearchTerm, setCitySearchTerm] = useState("");

  // const fetchWeb3event = async () => {
  // 	const data = {
  //     "pages": 0,
  //     "page_size": 0,
  //     "status": 1,
  //     "time": "",
  //     "time_to": "",
  //     "type": 1
  // };
  // 	try {
  // 		const result = await axios.post(`/api/explore`,data)
  // 		return result.data.data;
  // 	} catch (error) {
  // 		console.error('Error fetching web3event data list:', error);
  // 		throw error;
  // 	};
  // }

  // useEffect(() => {
  //   const fetchWeb3Data = async () => {
  //     try {
  //       const data = await fetchWeb3event();
  //       setWeb3Data(data);
  //       console.log('===========web3 events number======', data.length);
  //     } catch (error) {
  //       console.error('Error fetching web3 events:', error);
  //     }
  //   };

  //   fetchWeb3Data();
  // }, []);

  //   const fetchWeb3Data = async () => {
  //   try {
  //     console.log('Fetching Web3 events...');
  //     const data = await fetchWeb3event();
  //     console.log('Received Web3 events:', data);
  //     setWeb3Data(data);
  //     console.log('Web3 events set in state:', data.length);
  //   } catch (error) {
  //     console.error('Error fetching web3 events:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchWeb3Data();
  // }, []);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);
  console.log("=============events number==============", events?.length);

  const titleOptions = Array.from(
    new Set(events.map((event) => event?.title))
  ).map((title) => ({ value: title, label: title }));

  const cityOptions = Array.from(
    new Set(events.map((event) => event?.city))
  ).map((city) => ({ value: city, label: city }));

  const handleSearch = () => {
    const filtered = events.filter(
      (event) =>
        (titleSearchTerm === "" ||
          event?.title
            ?.toLowerCase()
            .includes(titleSearchTerm.toLowerCase())) &&
        (citySearchTerm === "" ||
          event?.city?.toLowerCase().includes(citySearchTerm.toLowerCase()))
    );
    setFilteredEvents(filtered);
  };

  const handleClearSearch = () => {
    setTitleSearchTerm("");
    setCitySearchTerm("");
    setFilteredEvents(events);
  };

  return (
    <div>
      {!loading ? (
        <div className="px-6 pt-[100px] mx-auto max-w-[100rem] lg:px-8">
          <div className="flex flex-col lg:flex-row w-full items-center justify-between p-4 space-y-4 lg:space-y-0">
            <div className="w-full lg:w-auto text-center lg:text-left lg:pl-8">
              <p className="text-white">You can explore all events here.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <AutoComplete
                className="w-full sm:w-64 lg:w-72"
                options={titleOptions}
                filterOption={(inputValue, option) =>
                  option?.value
                    ?.toLowerCase()
                    .indexOf(inputValue.toLowerCase()) !== -1
                }
                onSelect={(value) => setTitleSearchTerm(value)}
                onChange={(value) => setTitleSearchTerm(value)}
                value={titleSearchTerm}>
                <Input size="large" placeholder="Search by title" />
              </AutoComplete>
              <AutoComplete
                className="w-full sm:w-64 lg:w-72"
                options={cityOptions}
                filterOption={(inputValue, option) =>
                  option?.value
                    ?.toLowerCase()
                    .indexOf(inputValue.toLowerCase()) !== -1
                }
                onSelect={(value) => setCitySearchTerm(value)}
                onChange={(value) => setCitySearchTerm(value)}
                value={citySearchTerm}>
                <Input size="large" placeholder="Search by city" />
              </AutoComplete>
              <div className="flex space-x-4 w-full sm:w-auto">
                <Button
                  onClick={handleSearch}
                  type="primary"
                  size="large"
                  className="flex-1 sm:flex-none">
                  Search
                </Button>
                <Button
                  onClick={handleClearSearch}
                  type="primary"
                  size="large"
                  className="flex-1 sm:flex-none hover:bg-pink-500">
                  Clear
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-zinc-800 my-4" />

          <div
            className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-2 lg:grid-cols-4"
            style={{ fontFamily: "inherit" }}>
            {filteredEvents.map((event, key) => (
              <div key={key} className="grid grid-cols-1 gap-4 cursor-pointer">
                <Card key={1}>
                  <Link href={event?.url} target="blank">
                    <div className="cursor-pointer w-full h-[400px] relative">
                      <div className="cursor-pointer w-full h-[400px] relative">
                        <Image
                          className="rounded-xl overflow-hidden object-cover"
                          src={event.featureImage}
                          alt={event.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </div>
                    <div className="px-2">
                      <h1 className="text-xl font-bold font-pop text-white">
                        {event.title}
                      </h1>
                      <h2 className="text-white">{event.venueNameData}</h2>
                      <p className="text-white">{event.eventStartDay}</p>
                      <p className="text-white">{event.eventStartTime || ""}</p>
                      <p className="text-white">{event.eventTimeZone || ""}</p>
                    </div>
                  </Link>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <LoadingComponent />
      )}
    </div>
  );
};

export default MainPage;
