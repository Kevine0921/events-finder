import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const formatCityName = (cityName) => {
  // Remove spaces and the word 'city', then capitalize each word
  return cityName
    .replace(/\s+/g, "")
    .replace(/city/i, "")
    .replace(
      /(\w)(\w*)/g,
      (_, first, rest) => first.toUpperCase() + rest.toLowerCase()
    );
};

const getCityName = (geoAddressInfo) => {
  if (geoAddressInfo.city) {
    return formatCityName(geoAddressInfo.city);
  }
  if (geoAddressInfo.city_state) {
    // Split by comma, trim, and format just the city name
    return formatCityName(geoAddressInfo.city_state.split(",")[0].trim());
  }
  return "";
};

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "script", "luma_events.json");
    const jsonData = await fs.readFile(filePath, "utf8");
    const events = JSON.parse(jsonData);

    const formattedEvents = events.map((event) => {
      const eventData = event.event;
      const geoAddressInfo = eventData.geo_address_info || {};

      return {
        api_id: eventData.api_id,
        name: eventData.name,
        cover_url: eventData.cover_url,
        timezone: eventData.timezone,
        url: eventData.url,
        city: getCityName(geoAddressInfo),
        full_address: geoAddressInfo.full_address || "",
        start_at: eventData.start_at,
        end_at: eventData.end_at,
      };
    });

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error("Error reading or parsing Luma events:", error);
    return NextResponse.json(
      { error: "Failed to fetch Luma events" },
      { status: 500 }
    );
  }
}
