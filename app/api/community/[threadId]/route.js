import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connect from "@/lib/db";
import Thread from "@/models/Thread";
import Reply from "@/models/Reply";
import User from "@/models/User";
import { z } from "zod";

export const runtime = "nodejs";

const updateThreadSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(100, "Title must be at most 100 characters"),
  body: z.string().min(20, "Body must be at least 20 characters").max(2000, "Body must be at most 2000 characters"),
  tags: z.array(z.string().max(20, "Each tag must be at most 20 characters")).max(3, "Maximum 3 tags allowed").optional().default([]),
});

export async function GET(request, { params }) {
  try {
    await connect();

    const { threadId } = await params;

    // Fetch thread
    const thread = await Thread.findById(threadId)
      .populate("author", "name avatar country")
      .lean();

    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Increment views (fire-and-forget)
    Thread.findByIdAndUpdate(threadId, { $inc: { views: 1 } }).catch(err => {
      console.error("Error incrementing views:", err);
    });

    // Fetch replies
    const replies = await Reply.find({ thread: threadId })
      .populate("author", "name avatar country")
      .sort({ createdAt: 1 })
      .lean();

    // Check if current user is the author
    let isAuthor = false;
    const session = await auth();
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email }).lean();
      if (user && thread.author && user._id.toString() === thread.author._id.toString()) {
        isAuthor = true;
      }
    }

    return NextResponse.json({
      thread,
      replies,
      isAuthor,
    });
  } catch (error) {
    console.error("Error fetching thread:", error);
    return NextResponse.json(
      { error: "Failed to fetch thread" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { threadId } = await params;

    await connect();

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch thread
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (thread.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Delete all replies for this thread
    await Reply.deleteMany({ thread: threadId });

    // Delete thread
    await Thread.findByIdAndDelete(threadId);

    return NextResponse.json({ message: "Thread deleted successfully" });
  } catch (error) {
    console.error("Error deleting thread:", error);
    return NextResponse.json(
      { error: "Failed to delete thread" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { threadId } = await params;
    const body = await request.json();

    // Validate with Zod
    const validatedData = updateThreadSchema.parse(body);

    await connect();

    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch thread
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (thread.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Update thread
    const updatedThread = await Thread.findByIdAndUpdate(
      threadId,
      {
        title: validatedData.title,
        body: validatedData.body,
        tags: validatedData.tags,
      },
      { new: true }
    ).populate("author", "name avatar country").lean();

    return NextResponse.json(updatedThread);
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error updating thread:", error);
    return NextResponse.json(
      { error: "Failed to update thread" },
      { status: 500 }
    );
  }
}
