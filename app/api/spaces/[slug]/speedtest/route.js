import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Space from "@/models/Space";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  const { slug } = await params;

  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { speed, date, comment } = await request.json();

    // Validate input
    if (!speed || typeof speed !== "number" || speed <= 0 || speed > 1000) {
      return NextResponse.json(
        { error: "Valid speed (1-1000 Mbps) is required" },
        { status: 400 }
      );
    }

    await connect();

    // Find the space
    const space = await Space.findOne({ slug });
    if (!space) {
      return NextResponse.json(
        { error: "Space not found" },
        { status: 404 }
      );
    }

    // Add new speed test
    const newTest = {
      speed,
      reportedBy: session.user.id,
      date: date ? new Date(date) : new Date(),
      comment: comment || ""
    };

    space.speedTests.push(newTest);

    // Save will trigger the pre-save hook to recalculate wifiSpeed
    await space.save();

    return NextResponse.json({
      success: true,
      wifiSpeed: space.wifiSpeed,
      speedTestsCount: space.speedTests.length
    });
  } catch (error) {
    console.error("Error submitting speed test:", error);
    return NextResponse.json(
      { error: "Failed to submit speed test" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  const { slug } = await params;

  try {
    await connect();

    const space = await Space.findOne({ slug })
      .populate("speedTests.reportedBy", "name")
      .lean();

    if (!space) {
      return NextResponse.json(
        { error: "Space not found" },
        { status: 404 }
      );
    }

    // Return speed tests sorted by date (most recent first)
    const sortedTests = (space.speedTests || [])
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10); // Return last 10 tests

    return NextResponse.json({
      wifiSpeed: space.wifiSpeed,
      speedTests: sortedTests
    });
  } catch (error) {
    console.error("Error fetching speed tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch speed tests" },
      { status: 500 }
    );
  }
}
