import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Review from "@/models/Review";
import Space from "@/models/Space";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { slug } = await params;

  try {
    await connect();

    // Find the space to get its ID
    const space = await Space.findOne({ slug }).lean();
    if (!space) {
      return NextResponse.json(
        { error: "Space not found" },
        { status: 404 }
      );
    }

    // Fetch reviews for this space
    const reviews = await Review.find({
      targetId: space._id,
      targetType: "space"
    })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Format reviews to match expected structure
    const formattedReviews = reviews.map(review => ({
      _id: review._id.toString(),
      author: review.author?.name || "Anonymous",
      rating: review.rating,
      body: review.body,
      helpful: review.helpful?.length || 0,
      createdAt: review.createdAt
    }));

    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const { slug } = await params;

  try {
    const { rating, body, author } = await request.json();

    await connect();

    // Find the space to get its ID
    const space = await Space.findOne({ slug });
    if (!space) {
      return NextResponse.json(
        { error: "Space not found" },
        { status: 404 }
      );
    }

    // Create new review
    const review = new Review({
      author: author || null,
      targetId: space._id,
      targetType: "space",
      rating,
      body,
      helpful: []
    });

    await review.save();

    // Update space rating
    const allReviews = await Review.find({
      targetId: space._id,
      targetType: "space"
    }).lean();

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    space.rating = Math.round(avgRating * 10) / 10;
    space.reviewCount = allReviews.length;
    await space.save();

    return NextResponse.json({
      success: true,
      review: {
        _id: review._id.toString(),
        author: author || "Anonymous",
        rating: review.rating,
        body: review.body,
        helpful: 0,
        createdAt: review.createdAt
      }
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
