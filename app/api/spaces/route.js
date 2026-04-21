import { NextResponse } from "next/server";
import connect from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // TODO: Fetch from database when Space model is created
    // For now, return mock data
    const mockSpaces = [
      {
        _id: "1",
        name: "The Tribe House",
        location: "Vagator, Goa",
        type: "coworking",
        price: 15000,
        rating: 4.8,
        reviews: 124,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        amenities: ["WiFi", "AC", "Coffee", "Meeting Room"],
      },
      {
        _id: "2",
        name: "NomadNest",
        location: "Anjuna, Goa",
        type: "coliving",
        price: 25000,
        rating: 4.6,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800",
        amenities: ["WiFi", "AC", "Kitchen", "Pool"],
      },
      {
        _id: "3",
        name: "Workation Hub",
        location: "Baga, Goa",
        type: "coworking",
        price: 12000,
        rating: 4.5,
        reviews: 67,
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
        amenities: ["WiFi", "AC", "Coffee", "Standing Desk"],
      },
    ];

    const spaces = mockSpaces.slice(0, limit);

    return NextResponse.json(spaces);
  } catch (error) {
    console.error("Error fetching spaces:", error);
    return NextResponse.json(
      { error: "Failed to fetch spaces" },
      { status: 500 }
    );
  }
}
