import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connect from "@/lib/db";
import Thread from "@/models/Thread";
import User from "@/models/User";
import { z } from "zod";

export const runtime = "nodejs";

// Zod schema for thread creation
const createThreadSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(100, "Title must be at most 100 characters"),
  body: z.string().min(20, "Body must be at least 20 characters").max(2000, "Body must be at most 2000 characters"),
  tags: z.array(z.string().max(20, "Each tag must be at most 20 characters")).max(3, "Maximum 3 tags allowed").optional().default([]),
});

export async function GET(request) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const tag = searchParams.get("tag");
    const sort = searchParams.get("sort") || "recent"; // "popular" or "recent"

    // Build query
    const query = tag ? { tags: tag } : {};

    // Build sort
    let sortOption = { pinned: -1, createdAt: -1 };
    if (sort === "popular") {
      sortOption = { pinned: -1, upvotes: -1, createdAt: -1 };
    }

    // Get all unique tags
    const allTags = await Thread.distinct("tags");

    // Fetch threads with pagination
    const skip = (page - 1) * limit;
    const threads = await Thread.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("author", "name avatar country")
      .lean();

    // Get total count
    const total = await Thread.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      threads,
      total,
      page,
      totalPages,
      tags: allTags,
    });
  } catch (error) {
    console.error("Error fetching community threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch community threads" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    console.log("API - Session:", JSON.stringify(session, null, 2));

    if (!session || !session.user?.id) {
      console.log("API - No session or user.id");
      return NextResponse.json(
        { error: "Unauthorized", details: "No valid session" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("API - Body:", body);

    // Validate with Zod
    const validatedData = createThreadSchema.parse(body);

    console.log("API - Connecting to database...");
    try {
      await connect();
      console.log("API - Database connected");
    } catch (dbError) {
      console.error("API - Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed", details: dbError.message },
        { status: 500 }
      );
    }

    // Create slug from title
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    console.log("API - Creating thread with author:", session.user.id);
    
    // Create thread
    try {
      // Find or create user in MongoDB by email
      let user = await User.findOne({ email: session.user.email });
      
      if (!user) {
        user = await User.create({
          name: session.user.name || "Anonymous",
          email: session.user.email,
          avatar: session.user.image,
        });
      }
      
      var thread = await Thread.create({
        author: user._id,
        title: validatedData.title,
        slug,
        body: validatedData.body,
        tags: validatedData.tags,
      });
      console.log("API - Thread created:", thread._id);
    } catch (threadError) {
      console.error("API - Thread creation error:", threadError);
      return NextResponse.json(
        { error: "Thread creation failed", details: threadError.message },
        { status: 500 }
      );
    }

    // Populate author for response
    const populatedThread = await Thread.findById(thread._id)
      .populate("author", "name avatar country")
      .lean();

    return NextResponse.json(populatedThread, { status: 201 });
  } catch (error) {
    console.error("API - Error creating thread:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating thread:", error);
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    );
  }
}
