import { NextResponse } from "next/server";

export async function GET(
  req: Request
) {
  const { searchParams } = new URL(req.url);

  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { error: "City required" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
  );

  const data = await response.json();

  return NextResponse.json(data);
}