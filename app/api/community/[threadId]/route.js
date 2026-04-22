import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connect from "@/lib/db";
import Thread from "@/models/Thread";
import Reply from "@/models/Reply";

export const runtime = "nodejs";

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

    return NextResponse.json({
      thread,
      replies,
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

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { threadId } = await params;

    await connect();

    // Fetch thread
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (thread.author.toString() !== session.user.id) {
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
