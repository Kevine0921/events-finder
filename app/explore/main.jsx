"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/app/components/card";
import { LoadingComponent } from "@/app/components/loading";
import Image from "next/image";
import Link from "next/link";
import { useEvents } from "../hooks/useEvents";
import { AutoComplete, Input, Button, DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import updateLocale from "dayjs/plugin/updateLocale";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

// Extend Day.js with the plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(localeData);

// Update locale to start week on Sunday (0) instead of Monday (1)
dayjs.updateLocale("en", {
  weekStart: 0,
});

const { RangePicker } = DatePicker;

export const MainPage = () => {
  const { events, loading } = useEvents();

  const [filteredEvents, setFilteredEvents] = useState(events);
  const [titleSearchTerm, setTitleSearchTerm] = useState("");
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([dayjs(), dayjs().add(1, "week")]);
  const [options, setOptions] = useState([]);
  const [displayCount, setDisplayCount] = useState(60);

  const filterEventsByDateRange = (eventsToFilter, range) => {
    return eventsToFilter.filter((event) => {
      const eventDate = dayjs(event?.date, "YYYY-MM-DD");
      return (
        eventDate.isSameOrAfter(range[0], "day") &&
        eventDate.isSameOrBefore(range[1], "day")
      );
    });
  };

  useEffect(() => {
    if (events.length > 0) {
      const sortedEvents = events.sort((a, b) => {
        return dayjs(a.date, "YYYY-MM-DD").diff(dayjs(b.date, "YYYY-MM-DD"));
      });
      const initialFilteredEvents = filterEventsByDateRange(
        sortedEvents,
        dateRange
      );
      setFilteredEvents(initialFilteredEvents);
    }
  }, [events]);

  console.log("en", events?.length);

  const titleOptions = Array.from(
    new Set(events.map((event) => event?.title))
  ).map((title) => ({ value: title, label: title }));

  const formatCityName = (cityName) => {
    return cityName
      .replace(/\s*city\s*/i, "")
      .replace(/\s+/g, "")
      .toLowerCase()
      .replace(/^(.)/, (match) => match.toUpperCase());
  };

  const cityOptions = Array.from(
    new Set(
      events
        .map((event) => event?.city)
        .filter((city) => city && city.trim() !== "")
        .map(formatCityName)
    )
  )
    .map((city) => ({ value: city, label: city }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const handleSearch = () => {
    const filtered = events.filter((event) => {
      const eventDate = dayjs(event?.date, "YYYY-MM-DD");
      return (
        (titleSearchTerm === "" ||
          event?.title
            ?.toLowerCase()
            .includes(titleSearchTerm.toLowerCase())) &&
        (citySearchTerm === "" ||
          event?.city?.toLowerCase().includes(citySearchTerm.toLowerCase())) &&
        (!dateRange ||
          (eventDate.isSameOrAfter(dateRange[0], "day") &&
            eventDate.isSameOrBefore(dateRange[1], "day")))
      );
    });

    const sortedEvents = filtered.sort((a, b) => {
      return dayjs(a.date, "YYYY-MM-DD").diff(dayjs(b.date, "YYYY-MM-DD"));
    });

    setFilteredEvents(sortedEvents);
    setDisplayCount(60);
  };

  const handleClearSearch = () => {
    const defaultDateRange = [dayjs(), dayjs().add(1, "week")];
    setTitleSearchTerm("");
    setCitySearchTerm("");
    setDateRange(defaultDateRange);
    setOptions([]);
    const defaultFilteredEvents = filterEventsByDateRange(
      events,
      defaultDateRange
    );
    setFilteredEvents(defaultFilteredEvents);
    setDisplayCount(60);
  };

  const allOptions = useMemo(() => {
    return Array.from(new Set(events.map((event) => event?.title))).map(
      (title) => ({ value: title, label: title })
    );
  }, [events]);

  const onSearch = (searchText) => {
    setTitleSearchTerm(searchText);
    if (searchText === "") {
      setOptions(allOptions);
    } else {
      const filteredOptions = allOptions.filter((option) =>
        option.value.toLowerCase().includes(searchText.toLowerCase())
      );
      setOptions(filteredOptions);
    }
  };

  const truncateCity = (city) => {
    if (city.length > 10) {
      return city.slice(0, 7) + "...";
    }
    return city;
  };

  const inputStyle = {
    fontFamily: "Exo",
    height: "40px",
    fontSize: "16px",
  };

  console.log("====date==", dateRange);
  return (
    <ConfigProvider
      theme={{
        components: {
          DatePicker: {
            // You can customize the DatePicker theme here if needed
          },
        },
      }}
    >
      <div style={{ fontFamily: "Exo" }}>
        {!loading ? (
          <div className="px-6 pt-[100px] mx-auto max-w-[100rem] lg:px-8">
            <div className="flex flex-col items-center w-full space-y-4 p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
                <AutoComplete
                  className="w-full"
                  options={options}
                  onSearch={onSearch}
                  onSelect={(value) => setTitleSearchTerm(value)}
                  onChange={(value) => setTitleSearchTerm(value)}
                  value={titleSearchTerm}
                >
                  <Input
                    size="large"
                    placeholder="Search by title"
                    style={inputStyle}
                  />
                </AutoComplete>

                <AutoComplete
                  className="w-full"
                  options={cityOptions}
                  filterOption={(inputValue, option) =>
                    option?.value
                      ?.toLowerCase()
                      .indexOf(inputValue.toLowerCase()) !== -1
                  }
                  onSelect={(value) => setCitySearchTerm(value)}
                  onChange={(value) => setCitySearchTerm(value)}
                  value={citySearchTerm}
                >
                  <Input
                    size="large"
                    placeholder="Search by city"
                    style={inputStyle}
                  />
                </AutoComplete>

                {/* <RangePicker
                  className="w-full"
                  size="large"
                  onChange={(dates) => {
                    setDateRange(
                      dates
                        ? [dates[0].startOf("day"), dates[1].endOf("day")]
                        : null
                    );
                  }}
                  value={dateRange}
                  format="YYYY-MM-DD"
                  style={inputStyle}
                  showTime
                /> */}
                <RangePicker
                  className="w-full"
                  size="large"
                  onChange={(dates) => {
                    console.log("RangePicker onChange:", dates);
                    setDateRange(dates ? [dates[0], dates[1]] : null);
                  }}
                  value={dateRange}
                  format="YYYY-MM-DD HH:00"
                  style={inputStyle}
                  showTime={{
                    format: "HH",
                    hourStep: 1,
                    showSecond: false,
                    showMinute: false,
                    use12Hours: false,
                  }}
                  showHour={true}
                  showNow={false}
                  defaultPickerValue={[
                    dayjs().startOf("day"),
                    dayjs().endOf("day").startOf("hour"),
                  ]}
                />
              </div>

              <div className="flex space-x-4 mt-1">
                <Button
                  onClick={handleSearch}
                  type="default"
                  size="large"
                  className="bg-purple-800 text-white hover:bg-purple-900 px-8 w-full sm:w-auto"
                  style={{ fontFamily: "Exo" }}
                >
                  Search
                </Button>
                <Button
                  onClick={handleClearSearch}
                  type="default"
                  size="large"
                  className="bg-purple-800 text-white hover:bg-purple-900 px-8 w-full sm:w-auto"
                  style={{ fontFamily: "Exo" }}
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="w-full h-px bg-zinc-800 my-4" />

            <div
              className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-2 lg:grid-cols-4"
              style={{ fontFamily: "inherit" }}
            >
              {filteredEvents.slice(0, displayCount).map((event, key) => (
                <div
                  key={key}
                  className="grid grid-cols-1 gap-4 cursor-pointer"
                >
                  <Card className="">
                    <Link href={event?.url} target="blank">
                      <div className="cursor-pointer w-full h-[400px] relative">
                        <Image
                          className="rounded-t-xl overflow-hidden object-cover"
                          src={event.featureImage}
                          alt={event.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-2 rounded-b-xl">
                        <h1 className="text-2xl font-semibold text-white truncate">
                          {event.title}
                        </h1>
                        <div className="flex justify-between items-center">
                          {event?.city ? (
                            <span className="text-2xl bg-red-400 text-black px-2 py-1 rounded-full">
                              {truncateCity(event.city)}
                            </span>
                          ) : (
                            <div></div>
                          )}
                          {event?.date ? (
                            <span className="text-lg bg-yellow-400 text-black px-2 py-1 rounded-full">
                              {event?.date}
                            </span>
                          ) : (
                            <div></div>
                          )}
                          <span className="text-xl bg-blue-500 text-black px-2 py-1 rounded-full">
                            {event?.eventType}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Card>
                </div>
              ))}
            </div>
            <div className="w-full flex justify-center mt-8">
              {displayCount < filteredEvents.length && (
                <p
                  onClick={() => setDisplayCount((prevCount) => prevCount + 60)}
                  type="primary"
                  size="large"
                  className="text-white hover:text-violet-500 text-xl mb-10 hover:cursor-pointer"
                >
                  More events
                </p>
              )}
            </div>
          </div>
        ) : (
          <LoadingComponent />
        )}
      </div>
    </ConfigProvider>
  );
};

export default MainPage;
