import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: Request,
  { params }: { params: { book: string; author: string } }
): Promise<NextResponse> {
  const url = new URL(request.url);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY ?? "";

  const book = url.searchParams.get("book") ?? "";
  const author = url.searchParams.get("author") ?? "";

  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
    book
  )}+inauthor:${encodeURIComponent(author)}&key=${apiKey}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${request.headers.get("Authorization")}`,
      },
    });

    const data = response.data;
    return NextResponse.json(data);
  } catch (error: any) {
    const errorMessage = error.response?.data.message || error.message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
