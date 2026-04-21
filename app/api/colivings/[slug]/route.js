import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { slug } = await params;

  try {
    // In a real app, this would fetch from MongoDB
    // For now, return mock data
    const mockColivings = {
      "nomad-house-anjuna": {
        _id: "1",
        name: "Nomad House Anjuna",
        slug: "nomad-house-anjuna",
        area: "Anjuna",
        price: { monthly: 25000, weekly: 8000 },
        minStay: 7,
        rating: 4.5,
        reviewCount: 24,
        verified: true,
        includes: ["WiFi", "AC", "Breakfast", "Pool"],
        images: [],
        description: "A beautiful coliving space in the heart of Anjuna with all amenities included. Perfect for digital nomads looking for a productive and social environment.",
        roomTypes: [
          { type: "Private Room", price: 25000, available: true },
          { type: "Shared Room", price: 15000, available: false },
        ],
        address: "Near Beach Road, Anjuna, Goa"
      },
      "vagator-beach-hostel": {
        _id: "2",
        name: "Vagator Beach Hostel",
        slug: "vagator-beach-hostel",
        area: "Vagator",
        price: { monthly: 20000, weekly: 6000 },
        minStay: 14,
        rating: 4.2,
        reviewCount: 18,
        verified: false,
        includes: ["WiFi", "AC", "Kitchen"],
        images: [],
        description: "Budget-friendly coliving near Vagator beach with great community. Ideal for travelers on a budget who still want quality amenities.",
        roomTypes: [
          { type: "Dorm Bed", price: 10000, available: true },
          { type: "Private Room", price: 20000, available: true },
        ],
        address: "Chapora Fort Road, Vagator, Goa"
      },
      "morjim-paradise": {
        _id: "3",
        name: "Morjim Paradise",
        slug: "morjim-paradise",
        area: "Morjim",
        price: { monthly: 30000, weekly: 10000 },
        minStay: 30,
        rating: 4.8,
        reviewCount: 32,
        verified: true,
        includes: ["WiFi", "AC", "Breakfast", "Pool", "Gym"],
        images: [],
        description: "Premium coliving space with all luxury amenities included. Experience the best of Goa living with our top-notch facilities.",
        roomTypes: [
          { type: "Suite", price: 45000, available: true },
          { type: "Private Room", price: 30000, available: true },
        ],
        address: "Morjim Beach Road, Morjim, Goa"
      }
    };

    const coliving = mockColivings[slug];

    if (!coliving) {
      return NextResponse.json(
        { error: "Coliving not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(coliving);
  } catch (error) {
    console.error("Error fetching coliving:", error);
    return NextResponse.json(
      { error: "Failed to fetch coliving" },
      { status: 500 }
    );
  }
}
