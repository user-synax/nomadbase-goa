import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Space from "@/models/Space";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { slug } = await params;

  try {
    await connect();

    const space = await Space.findOne({ slug }).lean();

    if (!space) {
      return NextResponse.json(
        { error: "Space not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(space);
  } catch (error) {
    console.error("Error fetching space:", error);
    return NextResponse.json(
      { error: "Failed to fetch space" },
      { status: 500 }
    );
  }
}
