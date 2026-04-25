import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Space from "@/models/Space";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  const area = searchParams.get("area");

  try {
    await connect();

    // Build query
    const query = {};
    if (area) {
      query.area = area;
    }

    const spaces = await Space.find(query)
      .limit(limit)
      .lean();

    return NextResponse.json(spaces);
  } catch (error) {
    console.error("Error fetching spaces from DB:", error);
    // Fallback to mock data if database not available
    const mockSpaces = [
      {
        _id: "1",
        name: "The Tribe House",
        slug: "the-tribe-house",
        area: "Vagator",
        dailyPrice: 500,
        wifiSpeed: 150,
        rating: 4.8,
        verified: true,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        amenities: ["WiFi", "AC", "Coffee", "Meeting Room"],
      },
      {
        _id: "2",
        name: "NomadNest",
        slug: "nomadnest",
        area: "Anjuna",
        dailyPrice: 800,
        wifiSpeed: 100,
        rating: 4.6,
        verified: true,
        image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800",
        amenities: ["WiFi", "AC", "Kitchen", "Pool"],
      },
      {
        _id: "3",
        name: "Workation Hub",
        slug: "workation-hub",
        area: area || "Panaji",
        dailyPrice: 400,
        wifiSpeed: 120,
        rating: 4.5,
        verified: false,
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
        amenities: ["WiFi", "AC", "Coffee", "Standing Desk"],
      },
    ];

    const spaces = mockSpaces.slice(0, limit);
    return NextResponse.json(spaces);
  }
}
