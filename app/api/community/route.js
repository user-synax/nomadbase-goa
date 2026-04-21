import { NextResponse } from "next/server";
import connect from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // TODO: Fetch from database when Thread model is created
    // For now, return mock data
    const mockThreads = [
      {
        _id: "1",
        title: "Best cafes with reliable WiFi in North Goa?",
        content: "I'm looking for cafes where I can work during the day. Any recommendations?",
        author: "Sarah",
        replies: 12,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        title: "Coliving recommendations for 2-month stay",
        content: "Planning to stay in Goa for 2 months starting next month. Budget around ₹25k/month.",
        author: "Mike",
        replies: 8,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "3",
        title: "Monsoon season - worth it or avoid?",
        content: "Thinking about visiting during monsoon. How's the connectivity and coworking scene?",
        author: "Alex",
        replies: 15,
        createdAt: new Date().toISOString(),
      },
    ];

    const threads = mockThreads.slice(0, limit);

    return NextResponse.json(threads);
  } catch (error) {
    console.error("Error fetching community threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch community threads" },
      { status: 500 }
    );
  }
}
