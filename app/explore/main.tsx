"use client";
import React, { useState } from "react";
import { Card } from "@/app/components/card";
import { LoadingComponent } from "@/app/components/loading";
import Image from "next/image";
import Link from "next/link";
import { useEvents } from "../hooks/useEvents";
import { AutoComplete, Input } from "antd";

export const MainPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(2);
  const [eventsPerPage] = useState(80);
  const { events, paginationInfo, loading } = useEvents(
    currentPage,
    eventsPerPage
  );
  const [filterEvent, setFilterEvent] = useState(events);
  const options = events.map((event) => ({
    value: event?.title,
  }));

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      {!loading ? (
        <div className="px-6 pt-[100px] mx-auto max-w-[100rem] lg:px-8">
          <div className="flex items-center">
            <div className="w-[45%] pl-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-100 lg:text-4xl">
                Explore All events in the world
              </h2>
              <p className="mt-4 text-zinc-400">
                You can explore all events here.
              </p>
            </div>
          </div>
          <div className="w-full h-px bg-zinc-800" />
          {paginationInfo && (
            <div className="flex justify-center my-4">
              <Pagination
                currentPage={currentPage}
                totalPages={paginationInfo.totalPages}
                paginate={paginate}
              />
            </div>
          )}
          {/* <div className="h-[80px] px-2 py-2 flex justify-center items-center">
                <AutoComplete
                    popupClassName="certain-category-search-dropdown"
                    popupMatchSelectWidth={500}
                    style={{ width: 250 }}
                    options={options}
                    size="large"
                    filterOption={(inputValue, option) =>
                        option?.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 
                    }
                >
                    <Input.Search size="large" placeholder="search event title"/>
                </AutoComplete>
          </div> */}
          <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-2 lg:grid-cols-4">
            {events.map((event, key) => (
              <div key={key} className="grid grid-cols-1 gap-4 cursor-pointer">
                <Card key={1}>
                  <Link href={`/explore/${event.id}`}>
                    <div className="w-2/5 cursor-pointer">
                      <Image
                        className="object-contain w-full rounded-xl overflow-hidden my-2 mx-4"
                        src={event.featureImage}
                        alt={event.title}
                        width={100}
                        height={100}
                      />
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

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  paginate,
}) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex space-x-2">
        {currentPage > 1 && (
          <li>
            <button
              onClick={() => paginate(currentPage - 1)}
              className="px-3 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-violet-700">
              Previous
            </button>
          </li>
        )}
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number
                  ? "bg-violet-700 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-violet-700"
              }`}>
              {number}
            </button>
          </li>
        ))}
        {currentPage < totalPages && (
          <li>
            <button
              onClick={() => paginate(currentPage + 1)}
              className="px-3 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-violet-700">
              Next
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};
