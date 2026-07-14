import { NextResponse } from "next/server";
import ai from "@/lib/gemini";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
const session = await auth();

if (!session?.user?.email) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const loggedInUser = await prisma.user.findUnique({
  where: {
    email: session.user.email,
  },
});

if (!loggedInUser) {
  return NextResponse.json(
    { error: "User not found" },
    { status: 404 }
  );
}

    const {
      destination,
      days,
      budget,
      travelers,
      interests,
    } = await req.json();

const prompt = `
Create a ${days}-day travel itinerary for ${destination}
for ${travelers} traveler(s) with a budget of ₹${budget}.

Interests:
${interests.join(", ")}

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

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
});

const rawText = response.text ?? "";
console.log("GEMINI RESPONSE:");
console.log(rawText);

const text = rawText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

let itinerary;

try {
  itinerary = JSON.parse(text);
} catch {
  return NextResponse.json(
    {
      error: "AI returned invalid JSON",
    },
    { status: 500 }
  );
}

    const trip = await prisma.trip.create({
      data: {
        destination,
        days,
        budget,
        travelers,
        interests,
        itinerary,
        userId: loggedInUser.id,
      },
    });

    return NextResponse.json({
      message: "Trip generated and saved successfully",
      trip,
      itinerary,
    });
  } catch (error: any) {
  console.error(error);

  return NextResponse.json(
    {
      error:
        error?.message ||
        "Failed to generate itinerary",
    },
    { status: 500 }
  );
}
}