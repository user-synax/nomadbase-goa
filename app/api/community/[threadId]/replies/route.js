import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connect from "@/lib/db";
import Thread from "@/models/Thread";
import Reply from "@/models/Reply";
import User from "@/models/User";
import { z } from "zod";

export const runtime = "nodejs";

// Zod schema for reply creation
const createReplySchema = z.object({
  body: z.string().min(10, "Reply must be at least 10 characters").max(1000, "Reply must be at most 1000 characters"),
});

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
    console.log("Reply route - threadId:", threadId);
    
    const body = await request.json();
    console.log("Reply route - body:", body);

    // Validate with Zod
    const validatedData = createReplySchema.parse(body);

    await connect();

    // Check if thread exists
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Create reply
    let user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      user = await User.create({
        name: session.user.name || "Anonymous",
        email: session.user.email,
        avatar: session.user.image,
      });
    }
    
    const reply = await Reply.create({
      author: user._id,
      thread: threadId,
      body: validatedData.body,
    });

    // Increment reply count on thread
    await Thread.findByIdAndUpdate(threadId, { $inc: { replyCount: 1 } });

    // Populate author for response
    const populatedReply = await Reply.findById(reply._id)
      .populate("author", "name avatar country")
      .lean();

    return NextResponse.json(populatedReply, { status: 201 });
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
