import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { slug } = await params;

  try {
    // In a real app, this would fetch from MongoDB
    // For now, return mock data
    const mockReviews = [
      {
        _id: "1",
        author: "Alex Johnson",
        countryFlag: "🇺🇸",
        rating: 5,
        body: "Amazing coliving space! The community is great and the amenities are top-notch. Highly recommend for anyone looking to work and live in Goa.",
        helpful: 12,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: "2",
        author: "Maria Garcia",
        countryFlag: "🇪🇸",
        rating: 4,
        body: "Great location and facilities. The WiFi is fast and reliable. Only minor issue was the noise level sometimes, but overall a wonderful experience.",
        helpful: 8,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: "3",
        author: "Yuki Tanaka",
        countryFlag: "🇯🇵",
        rating: 5,
        body: "Perfect for digital nomads! The workspaces are comfortable and the community events are well-organized. Made many friends here.",
        helpful: 15,
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return NextResponse.json(mockReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
