import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Space from "@/models/Space";
import Coliving from "@/models/Coliving";
import Thread from "@/models/Thread";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json(
        { spaces: [], colivings: [], threads: [] },
        { status: 200 }
      );
    }

    await connect();

    // Create regex for case-insensitive partial matching
    const regex = new RegExp(query, "i");

    // Search Spaces (name, description, area) - limit to 5
    const spaces = await Space.find({
      $or: [
        { name: regex },
        { description: regex },
        { area: regex }
      ]
    })
      .limit(5)
      .select("_id name slug area")
      .lean();

    // Search Colivings (name, description, area) - limit to 5
    const colivings = await Coliving.find({
      $or: [
        { name: regex },
        { description: regex },
        { area: regex }
      ]
    })
      .limit(5)
      .select("_id name slug area")
      .lean();

    // Search Threads (title, body) - limit to 5
    const threads = await Thread.find({
      $or: [
        { title: regex },
        { body: regex }
      ]
    })
      .limit(5)
      .select("_id title slug")
      .lean();

    // Format results with type field
    const formattedSpaces = spaces.map(s => ({
      _id: s._id.toString(),
      name: s.name,
      slug: s.slug,
      area: s.area,
      type: "space"
    }));

    const formattedColivings = colivings.map(c => ({
      _id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      area: c.area,
      type: "coliving"
    }));

    const formattedThreads = threads.map(t => ({
      _id: t._id.toString(),
      title: t.title,
      slug: t.slug,
      type: "thread"
    }));

    return NextResponse.json({
      spaces: formattedSpaces,
      colivings: formattedColivings,
      threads: formattedThreads
    });
  } catch (error) {
    console.error("Error performing search:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
