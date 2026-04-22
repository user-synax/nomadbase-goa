import ThreadClient from "./ThreadClient";

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
  
  // Server-side data fetch
  let serverData = { thread: null, replies: [] };
  
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
        upvoted: false // Will be determined client-side with session
      };
    }
  } catch (error) {
    console.error("Error fetching thread server-side:", error);
  }
  
  return <ThreadClient threadId={threadId} serverData={serverData} />;
}
