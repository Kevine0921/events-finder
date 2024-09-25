"use client";
import React from "react";
import { Card } from "@/app/components/card";
import { Article } from "./article";
import { Web3event } from "@/app/components/web3eventType";
import { LoadingComponent } from "@/app/components/loading";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  EffectCoverflow,
  Pagination,
  FreeMode,
  Navigation,
  Autoplay,
} from "swiper/modules";
import { CaptionsIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import cls from "classnames";
import { useEvents } from "../hooks/useEvents";

type Props = {
  web3eventList: Web3event[];
};

export const MainPage: React.FC = () => {
  const events = useEvents();
  const [isLoading, setLoading] = useState(true);
  const [web3event, setWeb3event] = useState<Web3event[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [asteriskData, setAsteriskData] = useState();
  const [asteriskImages, setAsteriskImages] = useState([]);
  const [countInfo, setCountInfo] = useState<any>({});
  const [popCities, setPopCities] = useState([]);
  const [status, setStatus] = useState<number>(1);
  const [queryType, setQueryType] = useState<number>(0);
  const [fetchFull, setFetchFull] = useState(true);

  const fetchWeb3event = async (
    pages: number,
    status: number,
    queryType: number
  ) => {
    const data = {
      pages: pages,
      page_size: 20,
      keywords: "",
      topic: null,
      pay: null,
      status: status,
      query_type: queryType,
    };
    try {
      const result: any = await axios.post(`/api/explore`, data);
      return result.data.data;
    } catch (error) {
      console.error("Error fetching web3event data list:", error);
      throw error;
    }
  };

  const fetchInitialData = async () => {
    if (Array.isArray(events) && events.length !== 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  };

  const fetchMoreData = async () => {
    const web3eventList: Web3event[] = await fetchWeb3event(
      pages,
      status,
      queryType
    );
    setPages(pages + 1);
    if (web3event !== undefined) {
      if (Array.isArray(web3eventList) && web3eventList.length !== 0) {
        setWeb3event([...web3event, ...web3eventList]);
        setLoading(false);
      } else if (web3eventList === null) {
        setFetchFull(false);
      } else {
        setLoading(true);
      }
    } else {
      setLoading(true);
      setWeb3event([]);
    }
  };

  const fetchSortData = async (newStatus: number, newQueryType: number) => {
    const web3eventList: Web3event[] = await fetchWeb3event(
      0,
      newStatus,
      newQueryType
    );
    if (Array.isArray(web3eventList) && web3eventList.length !== 0) {
      setWeb3event(web3eventList);
      setPages(1);
      setFetchFull(true);
      setStatus(newStatus);
      setQueryType(newQueryType);
      setLoading(false);
    } else {
      setLoading(true);
      setWeb3event([]);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [events]);

  return (
    <div>
      {!isLoading ? (
        <div className="px-6 pt-[100px] mx-auto max-w-[100rem] lg:px-8">
          <div className="flex items-center">
            <div className="w-[45%] pl-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-100 lg:text-4xl">
                Explore All events in the world
              </h2>
              <p className="mt-4 text-zinc-400">
                You can explore all events here.
              </p>
              {/* <div className="flex justify-center items-center gap-4 h-[200px]">
							<div className="flex items-center gap-[10px]">
								<CaptionsIcon size={32} color="#a063ff" strokeWidth={3} />
								<div className="text-4xl text-zinc-200 font-bold font-sans">{countInfo?.event_count}</div>
								<div className="text-xl text-zinc-400 font-semibold">+ events</div>
							</div>
							<div className="flex items-center gap-[10px]">
								<MapPinIcon size={32} color="#a063ff" strokeWidth={3} />
								<div className="text-4xl text-zinc-200 font-bold font-sans">{countInfo?.city_count}</div>
								<div className="text-xl text-zinc-400 font-semibold">+ cities</div>
							</div>
						</div> */}
            </div>
            {/* <div className="w-[35%] flex-1">
						<Swiper
							effect={'coverflow'}
							grabCursor={true}
							centeredSlides={true}
							slidesPerView={'auto'}
							coverflowEffect={{
								rotate: 50,
								stretch: 0,
								depth: 650,
								modifier: 1,
								slideShadows: false,
								scale:0.5,
							}}
							loop={true}
							pagination={{
								clickable:true,
							}}
							autoplay={{
								delay: 2000,
								disableOnInteraction: false
							}}
							modules={[ EffectCoverflow, Pagination, Autoplay ]}
							className="asteriskSwiper"
						>
							{events.sort(() => Math.random() - 0.5).slice(0, 5).map((event:any ,key) => (
								<SwiperSlide key={key}>
									<div className="rounded-lg bg-zinc-800 border border-zinc-700">
										<div className="p-8 rounded-lg overflow-hidden">
											<img src={event.featureImage} height={10} width={10}/>
										</div>
										<div className="px-4 pb-4">
											<h1 className=" text-slate-200 text-xl">{event.title}</h1>
										</div>
									</div>
								</SwiperSlide>   
							))}
						</Swiper>
					</div> */}
          </div>
          {/* <div className="w-full">
					<Swiper
						slidesPerView="auto"
						spaceBetween={15}
						freeMode={true}
						pagination={{
						clickable: true,
						}}
						navigation={true}
						modules={[FreeMode, Pagination, Navigation]}
						className="popCitiesSwiper"
					>
						{popCities.map((city:any ,key) => (
							<SwiperSlide key={key}>
								<Link href={`/city/events/${city.id}`} className=" w-full rounded-lg overflow-hidden relative hover:cursor-pointer">
									<img src={city.image}/>
									<h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-300">{city.name}</h2>
								</Link>
							</SwiperSlide>   
						))}
					</Swiper>
				</div> */}
          <div className="w-full h-px bg-zinc-800 my-4" />
          {/* <div className="w-full mb-4 flex justify-start items-center mr-8">
					<div className="flex justify-start gap-3">
						<div className={cls("rounded-lg font-semibold px-3 py-2 text-center cursor-pointer hover:bg-violet-700 w-24",`${queryType == 0 ? "bg-violet-700 text-zinc-200": "bg-zinc-800 bg-opacity-70 text-zinc-300"}`)} onClick={() => {fetchSortData(1, 0)}}>Time</div>
						<div className={cls("rounded-lg font-semibold px-3 py-2 text-center cursor-pointer hover:bg-violet-700 w-24",`${queryType == 3 ? "bg-violet-700 text-zinc-200": "bg-zinc-800 bg-opacity-70 text-zinc-300"}`)} onClick={() => {fetchSortData(1, 3)}}>Hot</div>
						<div className={cls("rounded-lg font-semibold px-3 py-2 text-center cursor-pointer hover:bg-violet-700 w-24",`${queryType == 2 ? "bg-violet-700 text-zinc-200": "bg-zinc-800 bg-opacity-70 text-zinc-300"}`)} onClick={() => {fetchSortData(1, 2)}}>New</div>
					</div>
				</div> */}
          {/* <InfiniteScroll
					dataLength={web3event.length}
					next={fetchMoreData}
					hasMore={fetchFull}
					scrollThreshold={1}
					loader={<h4>Loading...</h4>}
				>
					<div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-2 lg:grid-cols-4">
						{web3event.slice(0, 4).map((web3event, key) => (
							<div key={key} className="grid grid-cols-1 gap-4">
								<Card key={1}>
									<Article web3event={web3event} />
								</Card>
							</div>
						))}
					</div>
				</InfiniteScroll> */}
          <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-2 lg:grid-cols-4">
            {events.slice(0, 80).map((event, key) => (
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
