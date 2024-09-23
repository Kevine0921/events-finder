import { NextResponse } from "next/server";

const apiKey = process.env.TICKETMASTER_API_KEY;
const querySize = "200";

export async function GET() {
  const ticketMasterURL = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=Sports&apikey=${apiKey}&size=${querySize}&sort=date,asc&countryCode=GB,IE,DE,AT,CH,BE,NL,FR,ES,IT,SE,NO,DK,FI,PL,CZ,HU,SK,BR,AR,CL,CA`;

  try {
    const response = await fetch(ticketMasterURL);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
