import { NextResponse } from "next/server";
import axios from "axios";
const apiKey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;
const querySize = "200";

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const result = await axios.post(
      `https://www.web3event.org/web3event/api/v2/map/events/query`,
      data
    );
    return NextResponse.json({ data: result.data.data }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching web3event data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
