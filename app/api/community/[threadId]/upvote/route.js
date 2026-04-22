import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connect from "@/lib/db";
import Thread from "@/models/Thread";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { threadId } = await params;
    const userId = session.user.id;

    await connect();

    // Find thread
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Check if user has already upvoted
    const hasUpvoted = thread.upvotes.includes(userId);

    if (hasUpvoted) {
      // Remove upvote
      await Thread.findByIdAndUpdate(threadId, {
        $pull: { upvotes: userId }
      });
    } else {
      // Add upvote
      await Thread.findByIdAndUpdate(threadId, {
        $push: { upvotes: userId }
      });
    }

    // Fetch updated thread
    const updatedThread = await Thread.findById(threadId).lean();

    return NextResponse.json({
      upvoted: !hasUpvoted,
      count: updatedThread.upvotes.length,
    });
  } catch (error) {
    console.error("Error toggling upvote:", error);
    return NextResponse.json(
      { error: "Failed to toggle upvote" },
      { status: 500 }
    );
  }
}
