import { notFound } from "next/navigation";
import SpaceDetail from "@/components/spaces/SpaceDetail";

export default async function SpaceDetailPage({ params }) {
  const { slug } = await params;

  // Fetch space data
  const spaceRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/spaces/${slug}`, { cache: 'no-store' });
  if (!spaceRes.ok) {
    notFound();
  }
  const space = await spaceRes.json();

  // Fetch reviews
  const reviewsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/spaces/${slug}/reviews`, { cache: 'no-store' });
  const reviews = await reviewsRes.json();

  return <SpaceDetail space={space} reviews={reviews} />;
}

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/spaces/${slug}`, { cache: 'no-store' });
    if (!res.ok) return {};
    const space = await res.json();
    
    return {
      title: `${space.name} — NomadBase Goa`,
      description: space.description || `Find ${space.name} in ${space.area}, Goa. Perfect co-working space for digital nomads.`,
    };
  } catch {
    return {};
  }
}
