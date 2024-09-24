"use client";
import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { AutoComplete, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";

const MapView = ({ web3eventMap }) => {
  console.log(web3eventMap.slice(0, 3), "==========map data");
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const [pageIsMounted, setPageIsMounted] = useState(false);
  const [map, setMap] = useState(null);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    setPageIsMounted(true);

    const map = new mapboxgl.Map({
      container: "web3eventMap",
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-103.5917, 40.6699],
      zoom: 1,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));

    initializeMap(map);
    setMap(map);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (pageIsMounted && map && web3eventMap) {
      const data = convertPreDataToGeoJSON(web3eventMap);

      map.on("load", () => {
        addDataLayer(map, data);
      });
    }
  }, [pageIsMounted, map, web3eventMap]);

  const web3eventListClickHandle = (event) => {
    if (!map) return;

    const coordinates = [
      event._embedded.venues[0].location.longitude,
      event._embedded.venues[0].location.latitude,
    ];
    map.flyTo({
      center: coordinates,
      zoom: 12,
    });

    const popupContent = `
            <div class="popup-container">
                <div class="event-content">
                    <div class="event-title">
                        <a href="/explore/${event?.id}">${event?.name}</a>
                    </div>
                    <div class="event-detail">
                        {event?.dates?.start?.localTime?(<div class="event-time">
                            <div class="event-clock"></div>
                            <p>${event?.dates?.start?.localTime}</p>
                        </div>):(<p><p>)}
                        <div class="event-place">
                            <div class="event-location"></div>
                            <p>${event?._embedded?.venues[0]?.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    const newPopup = new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(popupContent);

    if (popup) popup.remove();
    newPopup.addTo(map);
    setPopup(newPopup);
  };

  return (
    <div className="px-6 mx-auto max-w-[100rem] lg:px-8 pt-[70px] h-screen">
      <div className="w-full flex pt-3">
        <SideBar
          web3eventMap={web3eventMap}
          onTitleClick={web3eventListClickHandle}
        />
        <div id="web3eventMap" className="w-full h-[88vh]"></div>
      </div>
    </div>
  );
};

const addDataLayer = (map, data) => {
  map.addSource("web3events", {
    type: "geojson",
    data: data,
    cluster: true,
    clusterRadius: 50,
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "web3events",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": "#5c1b92",
      "circle-radius": 12,
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "web3events",
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 14,
    },
    paint: {
      "text-color": "#ffff00",
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "web3events",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#ed60e7",
      "circle-radius": 6,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });

  map.addLayer({
    id: "event-description",
    type: "symbol",
    source: "web3events",
    filter: ["!", ["has", "point_count"]],
    layout: {
      "text-field": ["get", "title"],
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 14,
      "text-offset": [0.5, 0],
      "text-anchor": "top-left",
    },
    paint: {
      "text-color": "#ffff00",
    },
  });
};

const initializeMap = (map) => {
  map.on("click", "clusters", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });

    const clusterId = features[0]?.properties?.cluster_id;
    const point_count = features[0]?.properties?.point_count;
    const coordinates = e.lngLat;
    const source = map.getSource("web3events");
    source.getClusterLeaves(clusterId, point_count, 0, (error, events) => {
      if (error) {
        console.error("Error fetching cluster leaves:", error);
        return;
      }
      const clusteredWeb3events = events;

      let popupHTML = '<div class="popup-container">';
      let count = 0;

      clusteredWeb3events.forEach((event) => {
        count = count + 1;
        popupHTML += `
                    <div class="event-content">
                        <div class="event-title">
                            <a href="/explore/${event?.properties?.id}">${count}. ${event?.properties?.title}</a>
                        </div>
                        <div class="event-detail">
                            <div class="event-time">
                                <div class="event-clock"></div>
                            <p>${event?.properties?.start_time}</p>
                            </div>
                            <div class="event-place">
                                <div class="event-location"></div>
                                <p>${event?.properties?.address}</p>
                            </div>
                        </div>
                    </div>`;
      });

      popupHTML += "</div>";

      new mapboxgl.Popup({
        closeButton: false,
        className: "custom-popup",
      })
        .setLngLat(coordinates)
        .setHTML(popupHTML)
        .addTo(map);
    });

    map.easeTo({
      center: coordinates,
    });
  });

  map.on("click", "unclustered-point", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["unclustered-point"],
    });

    const coordinates = e.lngLat;
    const web3eventProperty = features[0]?.properties;

    const popupHTML = `
            <div class="popup-container">
                <div class="event-content">
                    <div class="event-title">
                        <a href="/explore/${web3eventProperty?.id}">${web3eventProperty?.title}</a>
                    </div>
                    <div class="event-detail">
                        <div class="event-time">
                            <div class="event-clock"></div>
                            <p>${web3eventProperty?.start_time}</p>
                        </div>
                        <div class="event-place">
                            <div class="event-location"></div>
                            <p>${web3eventProperty?.address}</p>
                        </div>
                    </div>
                </div>
            </div>`;

    new mapboxgl.Popup({
      closeButton: false,
      className: "custom-popup",
    })
      .setLngLat(coordinates)
      .setHTML(popupHTML)
      .addTo(map);

    map.easeTo({
      center: coordinates,
    });
  });

  map.on("mouseenter", "clusters", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "clusters", () => {
    map.getCanvas().style.cursor = "";
  });

  map.on("mouseenter", "unclustered-point", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "unclustered-point", () => {
    map.getCanvas().style.cursor = "";
  });
};

const SideBar = ({ web3eventMap, onTitleClick }) => {
  const [filterEvent, setFilterEvent] = useState(web3eventMap);
  const options = web3eventMap.map((event) => ({
    value: event?.name,
    event: event,
  }));

  return (
    <div className="w-[450px] h-[88vh] bg-black py-2 ">
      <div className="h-[80px] px-2 py-2 flex justify-center items-center">
        <AutoComplete
          popupClassName="certain-category-search-dropdown"
          popupMatchSelectWidth={500}
          style={{ width: 250 }}
          options={options}
          size="large"
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onSelect={(value, option) => {
            onTitleClick(option.event);
          }}>
          <Input.Search size="large" placeholder="search event title" />
        </AutoComplete>
      </div>
      <div className="w-full h-[calc(88vh-96px)] px-2 overflow-y-auto scroll grid gap-2">
        {filterEvent.map((event, key) => (
          <div
            key={key}
            onClick={() => onTitleClick(event)}
            className="w-full rounded-lg border border-zinc-800 px-3 py-2">
            <div className="text-zinc-200 font-semibold text-lg">
              {event?.name}
            </div>
            <div className="text-[#11bb1c] text-sm">
              {event?.dates?.start?.localTime}
            </div>
            <div className="text-zinc-400 text-sm">
              {event?._embedded?.venues[0]?.name}
            </div>
            <div className="text-zinc-300 text-sm cursor-pointer">
              <Link href={event?.url}>Reservation</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function convertPreDataToGeoJSON(web3eventMap) {
  const features = web3eventMap.map((event) => ({
    type: "Feature",
    properties: {
      id: event.id,
      title: event.name,
      start_time: event?.dates?.start?.localTime,
      organizer: event?._embedded.venues[0].name,
      address: event?._embedded?.venues[0]?.address?.line1,
    },
    geometry: {
      type: "Point",
      coordinates: [
        event._embedded.venues[0].location.longitude,
        event._embedded.venues[0].location.latitude,
      ],
    },
  }));

  return {
    type: "FeatureCollection",
    features,
  };
}

export default MapView;
