import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import ai from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const trip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
    }

    const prompt = `
Create a NEW ${trip.days}-day travel itinerary for ${trip.destination}
for ${trip.travelers} traveler(s) with a budget of ₹${trip.budget}.

Interests:
${trip.interests.join(", ")}

Return ONLY valid JSON with NO markdown fences, NO explanation.

Format:

{
  "days": [
    {
      "day": 1,
      "places": [
        { "name": "Place Name", "type": "Temple / Beach / Museum etc.", "description": "Short description" }
      ],
      "food": [
        { "meal": "Breakfast / Lunch / Dinner", "description": "What to eat and where", "costEstimate": 300 }
      ],
      "estimatedCost": 3000,
      "tips": "Some travel tip"
    }
  ]
}

Do not include markdown.
Do not include explanation.
Return JSON only.
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

    const text = response.text ?? "";

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const itinerary =
      JSON.parse(cleanedText);

    await prisma.trip.update({
      where: { id },
      data: {
        itinerary,
      },
    });

    return NextResponse.json({
      message: "Trip regenerated",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to regenerate trip",
      },
      {
        status: 500,
      }
    );
  }
}