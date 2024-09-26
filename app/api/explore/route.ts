import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
const apiKey = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;

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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const size = searchParams.get("size") || "20";

  const ticketMasterURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&size=${size}&page=${page}&sort=date,asc&countryCode=GB,IE,DE,AT,CH,BE,NL,FR,ES,IT,SE,NO,DK,FI,PL,CZ,HU,SK,BR,AR,CL,CA`;

  try {
    const response = await fetch(ticketMasterURL);
    const data = await response.json();

    // Extract pagination information
    const totalElements = data.page?.totalElements || 0;
    const totalPages = data.page?.totalPages || 0;
    const currentPage = data.page?.number || 1;
    const pageSize = data.page?.size || 80;

    // Prepare the response
    const formattedResponse = {
      events: data._embedded?.events || [],
      pagination: {
        totalElements,
        totalPages,
        currentPage,
        pageSize,
      },
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
