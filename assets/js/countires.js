let searchList = $("#previous-searches");
let recommendedList = $("#recommended-areas");
searchStorage = JSON.parse(localStorage.getItem("pastSearches"));

if ((localStorage = null)) {
  localStorage.setItem("pastSearches", null);
}

let apiKey = "hw2ECqSjHs5Kx7L80Qe7LunEDU1JCWPV";
let querySize = "200";
let art = "Arts & Theatre";

const mapBoxKey =
  "pk.eyJ1Ijoienp6YmlhIiwiYSI6ImNsM3ZubXB0djJuc2UzZGw4NHBscnltb3IifQ.DW29ynZDDnPeH6hmtl8O8g"; // set the access token
mapboxgl.accessToken = mapBoxKey;
const initLng = 0;
const initLat = 0;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/zzzbia/cl3yk4t1e000h15s3i77cogqd", // The map style to use
  center: [initLng, initLat],
  zoom: 1.5,
});

function getData() {
  let ticketMasterURL =
    "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=Miscellaneous&countryCode=US,CA,GB,IE,DE,AT,CH,BE,NL,FR,ES,IT,SE,NO,DK,FI,PL,CZ,HU,SK,BR,AR,CL&apikey=" +
    apiKey +
    "&size=" +
    querySize +
    "&sort=date,asc";
  fetch(ticketMasterURL, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let events = [];
      let currentDate = moment().format("YYYY-MM-DD");
      let startWeekDate = moment().subtract(1, "days").format("YYYY-MM-DD");
      let endWeekDate = moment().add(8, "days").format("YYYY-MM-DD");

      let eventData = data._embedded.events;
      for (i = 0; i < data._embedded.events.length; i++) {
        let dateData = data._embedded.events[i].dates.start.localDate;
        function checkBetween(date1, date2, date3) {
          return moment(date1).isBetween(date2, date3);
        }

        let dateCheck = checkBetween(dateData, startWeekDate, endWeekDate);

        let cancelledCheck = eventData[i].dates.status.code;
        if (dateCheck && cancelledCheck === "onsale") {
          let latData = eventData[i]._embedded.venues[0].location.latitude;
          let lonData = eventData[i]._embedded.venues[0].location.longitude;
          let eventTitleData = eventData[i].name;
          let eventURL = eventData[i].url;
          let venueNameData = eventData[i]._embedded.venues[0].name;
          let featureImage = eventData[i].images[0].url;
          let eventStartDay = eventData[i].dates.start.localDate;
          let eventStartTime = eventData[i].dates.start.localTime;
          console.log(dateCheck);
          if (
            latData &&
            lonData &&
            eventTitleData &&
            eventURL &&
            venueNameData
          ) {
            events.push({
              lat: latData,
              lon: lonData,
              title: eventTitleData,
              url: eventURL,
              venueNameData: venueNameData,
              featureImage: featureImage,
              eventStartDay: eventStartDay,
              eventStartTime: eventStartTime,
            });
          }
        }
      }
      if (events.length) {
        startMapBox(events);
      } else {
        alert("No events found in your area");
      }
    })
    .catch((e) => {
      console.error(e);
    });
}

const startMapBox = async (events) => {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/zzzbia/cl3yk4t1e000h15s3i77cogqd",
    center: [initLng, initLat],
    zoom: 1.5,
  });

  recommendedAreas = [
    {
      address: "Scotiabank Arena",
      lon: -79.3791035,
      lat: 43.6433895,
    },
    {
      address: "Ontario Place",
      lon: -79.41511374999999,
      lat: 43.62939075,
    },
    {
      address: "Danforth Music Hall",
      lon: -79.357071,
      lat: 43.676338,
    },
  ];

  function recommendedSearches() {
    if (recommendedAreas !== null) {
      for (let i = 0; i < recommendedAreas.length; i++) {
        let recommendedListItem = $("<h2>").data({
          address: recommendedAreas[i].address,
          lon: recommendedAreas[i].lon,
          lat: recommendedAreas[i].lat,
        });

        recommendedListItem.addClass(
          "text-xl cursor-pointer hover:text-cyan-700"
        );

        recommendedListItem.text(recommendedAreas[i].address);
        recommendedList.append(recommendedListItem);
        recommendedListItem.on("click", (e) => {
          map.flyTo({
            center: [
              recommendedListItem.data("lon"),
              recommendedListItem.data("lat"),
            ],
            zoom: 15,
          });
        });
      }
      return;
    }
  }
  recommendedSearches();

  function pastSearches() {
    if (searchStorage !== null) {
      document.getElementById("past-search-container").style.display = "block";

      if (!document.getElementById("clear-btn")) {
        const clearLocalStorageBtn = document.createElement("span");
        clearLocalStorageBtn.id = "clear-btn";
        clearLocalStorageBtn.className = "mx-auto my-auto cursor-pointer group";
        clearLocalStorageBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24"
							class="fill-[#3A485F] group-hover:fill-red-400" fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<rect x="15.7427" y="6.55029" width="1" height="13"
								transform="rotate(45 15.7427 6.55029)" />
							<rect x="16.4497" y="15.7427" width="1" height="13"
								transform="rotate(135 16.4497 15.7427)" />
						</svg>`;

        clearLocalStorageBtn.addEventListener("click", () => {
          window.localStorage.clear();
          document.getElementById("past-search-container").style.display =
            "none";
        });

        document
          .getElementById("clear-past-searches")
          .appendChild(clearLocalStorageBtn);
      }

      $("h3").remove();
      for (let i = 0; i < searchStorage.length; i++) {
        let searchListItem = $("<h3>").data({
          address: searchStorage[i].address,
          lon: searchStorage[i].lon,
          lat: searchStorage[i].lat,
        });
        searchListItem.text(searchStorage[i].address);
        searchList.append(searchListItem);
        searchListItem.addClass("text-xl cursor-pointer hover:text-cyan-700");

        searchListItem.on("click", (e) => {
          map.flyTo({
            center: [searchListItem.data("lon"), searchListItem.data("lat")],
          });
        });
      }
      return;
    }
    searchStorage = [];
  }
  pastSearches();

  map.on("load", async () => {
    const tileset = "zzzbia.ahqydxq2";
    const radius = 1609;
    const limit = 50;
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      zoom: 13,
      placeholder: "   Enter an address or place name",
      bbox: [-180, -90, 180, 90],
    });

    map.addControl(geocoder, "top-left");

    geocoder.on("result", function (results) {
      let locationTitle = results.result.text;
      let lonLocation = results.result.geometry.coordinates[0];
      let latLocation = results.result.geometry.coordinates[1];
      let locationAddress = results.result.place_name;

      searchListItem = $("<h3>")
        .html(locationAddress)
        .data({ lon: lonLocation, lat: latLocation });

      searchStorage.push({
        address: locationAddress,
        lon: lonLocation,
        lat: latLocation,
      });
      localStorage.setItem("pastSearches", JSON.stringify(searchStorage));
      pastSearches();
    });

    const marker = new mapboxgl.Marker({ color: "#da373d" });

    map.addSource("tilequery", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    const query = await fetch(
      `https://api.mapbox.com/v4/${tileset}/tilequery/-79.347015,43.65107.json?radius=${
        radius * 500
      }&limit=${50}&access_token=${mapboxgl.accessToken}`,
      { method: "GET" }
    );

    const json = await query.json();
    map.getSource("tilequery").setData(json);

    geocoder.on("result", async (event) => {
      const point = event.result.center;

      const query = await fetch(
        `https://api.mapbox.com/v4/${tileset}/tilequery/${point[0]},${
          point[1]
        }.json?radius=${radius * 20}&limit=${50}&access_token=${
          mapboxgl.accessToken
        }`,
        { method: "GET" }
      );

      const json = await query.json();
      map.getSource("tilequery").setData(json);

      marker.setLngLat(point).addTo(map);
    });

    map.addLayer({
      id: "tilequery-points",
      type: "circle",
      source: "tilequery",
      paint: {
        "circle-stroke-color": "white",
        "circle-stroke-width": {
          stops: [
            [0, 0.1],
            [18, 3],
          ],
          base: 5,
        },
        "circle-radius": {
          stops: [
            [12, 5],
            [22, 180],
          ],
          base: 5,
        },
        "circle-color": [
          "match",
          ["get", "Park Name"],
          "Building Name",
          "#93C572",
          "#E49B0F",
        ],
      },
    });
    for (let i = 0; i < events.length; i++) {
      const maboxMarker = new mapboxgl.Marker({});

      maboxMarker.setLngLat([events[i].lon, events[i].lat]);

      maboxMarker.setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(
            `<h3  id="headingPopup" class="text-sky-500 font-bold ;hover:text-sky-600 font-bold ">${
              events[i].title
            }</h3>
						<img class="rounded drop-shadow-md" src="${events[i].featureImage}">
						<p class="text-cyan-900 font-medium"> Location: ${events[i].venueNameData} </p>
						<p class="text-cyan-900 font-medium"> Playing on: ${events[i].eventStartDay}</p>
						<p class="text-cyan-900 font-medium" Start Time: ${
              events[i].eventStartTime || ""
            }</p>
						<a class=" border border-sky-600  text-l rounded-lg bg-sky-500 p-1 font-bold shadow-lg shadow-blue-500/40 hover:opacity-90 hover:text-white" href="${
              events[i].url
            }" target="_blank"> Book Now</a>`
          )
      );

      maboxMarker.addTo(map);
    }
    function showEventList() {
      const topEvents = events.slice(0, 5);
      const eventList = document.getElementById("event-list");
      topEvents.forEach((event) => {
        const eventListItem = document.createElement("div");
        eventListItem.innerHTML = `                  
					<div class="w-full py-3 border-t border-b border-black border-opacity-10 flex flex-nowrap cursor-pointer hover:opacity-80">
					<div class="w-1/4">
						<img class="object-contain w-full rounded-xl overflow-hidden"
							src="${event.featureImage}">
					</div>
					<div class="w-3/4 px-2">
						<h1 class="text-xl font-bold font-pop text-2xl font-bold text-white">${
              event.title
            }</h1>
						<h2>${event.venueNameData}</h2>
						<p>${event.eventStartDay}</p>
						<p>${event.eventStartTime || ""}</p>
					</div>
				</div>`;

        eventListItem.addEventListener("click", () => {
          map.flyTo({
            center: [event.lon, event.lat],
            zoom: 15,
          });
        });
        eventList.appendChild(eventListItem);
      });
    }
    showEventList();
  });
};

$(document).ready(function () {
  getData();
});
