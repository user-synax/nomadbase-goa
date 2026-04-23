import ThreadClient from "./ThreadClient";
import { auth } from "@/lib/auth";
import connect from "@/lib/db";
import User from "@/models/User";

export async function generateMetadata({ params }) {
  const { threadId } = await params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/community/${threadId}`, {
      cache: 'no-store'
    });
    const data = await response.json();
    
    if (data.thread) {
      return {
        title: `${data.thread.title} — NomadBase Community`,
      };
    }
  } catch (error) {
    console.error("Error fetching thread for metadata:", error);
  }
  
  return {
    title: "Thread — NomadBase Community",
  };
}

export default async function ThreadPage({ params }) {
  const { threadId } = await params;
  
  let serverData = { thread: null, replies: [], isAuthor: false };
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/community/${threadId}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      serverData = {
        thread: data.thread,
        replies: data.replies || [],
        upvoteCount: data.thread?.upvotes?.length || 0,
        isAuthor: data.isAuthor || false
      };
    }
  } catch (error) {
    console.error("Error fetching thread server-side:", error);
  }
  
  try {
    const session = await auth();
    if (session?.user?.email) {
      await connect();
      const user = await User.findOne({ email: session.user.email }).lean();
      if (user && serverData.thread?.author) {
        if (user._id.toString() === serverData.thread.author._id?.toString()) {
          serverData.isAuthor = true;
        }
      }
    }
  } catch (error) {
    console.error("Error checking author status:", error);
  }
  
  return <ThreadClient threadId={threadId} serverData={serverData} />;
}