import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connect from "@/lib/db";
import Thread from "@/models/Thread";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request, { params }) {
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

    // Find thread
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Check if user has already upvoted (compare as strings)
    const hasUpvoted = thread.upvotes.some(up => up.toString() === user._id.toString());

    if (hasUpvoted) {
      // Remove upvote
      await Thread.findByIdAndUpdate(threadId, {
        $pull: { upvotes: user._id }
      });
    } else {
      // Add upvote
      await Thread.findByIdAndUpdate(threadId, {
        $push: { upvotes: user._id }
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
