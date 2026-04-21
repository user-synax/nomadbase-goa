import { notFound } from "next/navigation";
import { ColivingDetail } from "@/components/colivings/ColivingDetail";

export default async function ColivingDetailPage({ params }) {
  const { slug } = await params;
  
  // Fetch coliving data
  const colivingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/colivings/${slug}`, { cache: 'no-store' });
  if (!colivingRes.ok) {
    notFound();
  }
  const coliving = await colivingRes.json();

  // Fetch reviews
  const reviewsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/colivings/${slug}/reviews`, { cache: 'no-store' });
  const reviews = await reviewsRes.json();

  return <ColivingDetail coliving={coliving} reviews={reviews} />;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/colivings/${slug}`, { cache: 'no-store' });
    if (!res.ok) return {};
    const coliving = await res.json();
    
    return {
      title: `${coliving.name} — NomadBase Goa`,
      description: coliving.description || `Find ${coliving.name} in ${coliving.area}, Goa. Perfect coliving space for digital nomads.`,
    };
  } catch {
    return {};
  }
}