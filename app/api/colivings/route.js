import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // Get filter parameters
  const areas = searchParams.get("areas")?.split(",") || [];
  const maxPrice = searchParams.get("maxPrice");
  const minStay = searchParams.get("minStay");
  const includes = searchParams.get("includes")?.split(",") || [];
  const verified = searchParams.get("verified") === "true";
  const sortBy = searchParams.get("sortBy") || "best-rated";

  try {
    // In a real app, this would fetch from MongoDB
    // For now, return mock data
    const mockColivings = [
      {
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
        description: "A beautiful coliving space in the heart of Anjuna with all amenities included.",
        roomTypes: [
          { type: "Private Room", price: 25000, available: true },
          { type: "Shared Room", price: 15000, available: false },
        ],
        address: "Near Beach Road, Anjuna, Goa"
      },
      {
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
        description: "Budget-friendly coliving near Vagator beach with great community.",
        roomTypes: [
          { type: "Dorm Bed", price: 10000, available: true },
          { type: "Private Room", price: 20000, available: true },
        ],
        address: "Chapora Fort Road, Vagator, Goa"
      },
      {
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
        description: "Premium coliving space with all luxury amenities included.",
        roomTypes: [
          { type: "Suite", price: 45000, available: true },
          { type: "Private Room", price: 30000, available: true },
        ],
        address: "Morjim Beach Road, Morjim, Goa"
      }
    ];

    // Apply filters (mock implementation)
    let filteredColivings = mockColivings.filter((coliving) => {
      if (areas.length > 0 && !areas.includes(coliving.area)) return false;
      if (maxPrice && coliving.price.monthly > parseInt(maxPrice)) return false;
      if (verified && !coliving.verified) return false;
      if (includes.length > 0) {
        const hasAllIncludes = includes.every((inc) => 
          coliving.includes.some((c) => c.toLowerCase().includes(inc.toLowerCase()))
        );
        if (!hasAllIncludes) return false;
      }
      return true;
    });

    // Sort
    if (sortBy === "price-low") {
      filteredColivings.sort((a, b) => a.price.monthly - b.price.monthly);
    } else if (sortBy === "price-high") {
      filteredColivings.sort((a, b) => b.price.monthly - a.price.monthly);
    } else {
      filteredColivings.sort((a, b) => b.rating - a.rating);
    }

    return NextResponse.json({
      colivings: filteredColivings,
      total: filteredColivings.length
    });
  } catch (error) {
    console.error("Error fetching colivings:", error);
    return NextResponse.json(
      { error: "Failed to fetch colivings" },
      { status: 500 }
    );
  }
}
