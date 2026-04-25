import { notFound } from "next/navigation";
import Link from "next/link";
import { getAreaBySlug, areaExists } from "@/lib/areaData";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { SpaceCard } from "@/components/spaces/SpaceCard";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Star,
  IndianRupee,
  Car,
  Utensils,
  Waves,
  Sparkles,
  MessageCircle,
  ArrowRight,
  Users,
  Home,
  Briefcase
} from "lucide-react";

export async function generateMetadata({ params }) {
  const { area } = await params;
  const areaData = getAreaBySlug(area);

  if (!areaData) {
    return {
      title: "Area Not Found — NomadBase Goa",
    };
  }

  return {
    title: `${areaData.name} — Digital Nomad Guide | NomadBase Goa`,
    description: `${areaData.vibe}. Find coworking spaces, colivings, and essential nomad info for ${areaData.name}, Goa.`,
  };
}

export async function generateStaticParams() {
  // Generate static paths for all areas
  const areas = [
    "panaji", "calangute", "vagator", "anjuna", "colva",
    "margao", "mapusa", "candolim", "arambol"
  ];
  return areas.map((area) => ({ area }));
}

export default async function AreaPage({ params }) {
  const { area } = await params;
  const areaData = getAreaBySlug(area);

  if (!areaData) {
    notFound();
  }

  // Fetch spaces in this area
  const spacesRes = await fetch(
    `/api/spaces?area=${areaData.name}`,
    { cache: 'no-store' }
  );
  const spaces = spacesRes.ok ? await spacesRes.json() : [];

  // Fetch colivings in this area
  const colivingsRes = await fetch(
    `/api/colivings?area=${areaData.name}`,
    { cache: 'no-store' }
  );
  const colivings = colivingsRes.ok ? await colivingsRes.json() : [];

  // Star rating display component
  const StarRating = ({ rating }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "fill-[#3ecf8e] text-[#3ecf8e]" : "text-[#2e2e2e]"}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-[#171717] min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="border-b border-[#242424] pb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[14px] text-[#898989] mb-4" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            <Link href="/" className="hover:text-[#3ecf8e] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#b4b4b4]">{areaData.name}</span>
          </div>

          {/* Area Name & Tagline */}
          <h1 className="text-[48px] md:text-[72px] leading-[1.00] font-normal text-[#fafafa] mb-4" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {areaData.name}
          </h1>
          <p className="text-[18px] md:text-[24px] text-[#3ecf8e]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {areaData.tagline}
          </p>
          <p className="text-[16px] leading-[1.50] text-[#b4b4b4] mt-4 max-w-2xl" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {areaData.vibe}
          </p>
        </div>
      </section>

      {/* QUICK STATS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Average Rent */}
          <div className="p-6 rounded-[8px] bg-[#0f0f0f] border border-[#2e2e2e]">
            <div className="flex items-center gap-2 mb-3">
              <IndianRupee size={18} className="text-[#3ecf8e]" />
              <span className="text-sm font-medium text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Average Rent
              </span>
            </div>
            <p className="text-[24px] font-normal text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
              ₹{areaData.averageRent.toLocaleString()}
              <span className="text-[14px] text-[#898989] ml-1">/month</span>
            </p>
          </div>

          {/* Nomad Rating */}
          <div className="p-6 rounded-[8px] bg-[#0f0f0f] border border-[#2e2e2e]">
            <div className="flex items-center gap-2 mb-3">
              <Star size={18} className="text-[#3ecf8e]" />
              <span className="text-sm font-medium text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Nomad Rating
              </span>
            </div>
            <div className="flex items-center gap-3">
              <StarRating rating={areaData.nomadRating} />
              <span className="text-[24px] font-normal text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
                {areaData.nomadRating}/5
              </span>
            </div>
          </div>

          {/* Best For */}
          <div className="p-6 rounded-[8px] bg-[#0f0f0f] border border-[#2e2e2e]">
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-[#3ecf8e]" />
              <span className="text-sm font-medium text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Best For
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {areaData.bestFor.slice(0, 3).map((item, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-[12px] rounded-full bg-[#242424] text-[#fafafa]"
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <h2 className="text-[24px] leading-[1.33] font-normal mb-6 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
          Quick Facts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {areaData.quickFacts.map((fact, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-[8px] bg-[#0f0f0f] border border-[#2e2e2e]">
              <Sparkles size={16} className="text-[#3ecf8e] mt-0.5 flex-shrink-0" />
              <p className="text-[14px] leading-[1.5] text-[#b4b4b4]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                {fact}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* NEARBY BEACHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <div className="flex items-center gap-2 mb-6">
          <Waves size={24} className="text-[#3ecf8e]" />
          <h2 className="text-[24px] leading-[1.33] font-normal text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
            Nearby Beaches
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {areaData.nearbyBeaches.map((beach, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa]"
              style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
            >
              <MapPin size={14} className="text-[#3ecf8e]" />
              {beach}
            </div>
          ))}
        </div>
      </section>

      {/* FOOD OPTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <div className="flex items-center gap-2 mb-6">
          <Utensils size={24} className="text-[#3ecf8e]" />
          <h2 className="text-[24px] leading-[1.33] font-normal text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
            Food Scene
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {areaData.foodOptions.map((food, i) => (
            <div
              key={i}
              className="p-4 rounded-[8px] bg-[#0f0f0f] border border-[#2e2e2e] text-center"
            >
              <p className="text-[14px] text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                {food}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TRANSPORT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <div className="flex items-center gap-2 mb-6">
          <Car size={24} className="text-[#3ecf8e]" />
          <h2 className="text-[24px] leading-[1.33] font-normal text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
            Getting Around
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {areaData.transport.map((transport, i) => (
            <div
              key={i}
              className="px-4 py-2 rounded-full bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa]"
              style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
            >
              {transport}
            </div>
          ))}
        </div>
      </section>

      {/* COWORKING SPACES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <div className="flex items-center gap-2 mb-6">
          <Briefcase size={24} className="text-[#3ecf8e]" />
          <h2 className="text-[24px] leading-[1.33] font-normal text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
            Coworking Spaces
          </h2>
        </div>
        {spaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <SpaceCard key={space._id || space.slug} space={space} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-[8px] bg-[#0f0f0f] border border-[#2e2e2e] text-center">
            <p className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              No coworking spaces listed yet in {areaData.name}.
            </p>
            <Link href={`/spaces?area=${areaData.name}`}>
              <Button
                variant="outline"
                className="mt-4 text-[#3ecf8e] border-[#3ecf8e] hover:bg-[#3ecf8e]/10 rounded-full"
                style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
              >
                Explore All Spaces <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* COLIVINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <div className="flex items-center gap-2 mb-6">
          <Home size={24} className="text-[#3ecf8e]" />
          <h2 className="text-[24px] leading-[1.33] font-normal text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
            Colivings
          </h2>
        </div>
        {colivings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colivings.map((coliving) => (
              <Link
                key={coliving._id || coliving.slug}
                href={`/colivings/${coliving.slug}`}
                className="block p-6 rounded-[8px] bg-[#0f0f0f] border border-[#2e2e2e] hover:border-[rgba(62, 207, 142, 0.3)] transition-colors"
              >
                <h3 className="text-[20px] font-normal text-[#fafafa] mb-2" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
                  {coliving.name}
                </h3>
                <p className="text-[14px] text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  ₹{coliving.pricing?.monthly?.toLocaleString() || coliving.price?.toLocaleString()}/month
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-[8px] bg-[#0f0f0f] border border-[#2e2e2e] text-center">
            <p className="text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              No colivings listed yet in {areaData.name}.
            </p>
            <Link href={`/colivings?area=${areaData.name}`}>
              <Button
                variant="outline"
                className="mt-4 text-[#3ecf8e] border-[#3ecf8e] hover:bg-[#3ecf8e]/10 rounded-full"
                style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
              >
                Explore All Colivings <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* ASK AI CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#242424]">
        <div className="p-8 rounded-[16px] bg-[#0f0f0f] border border-[#2e2e2e] text-center">
          <MessageCircle size={48} className="mx-auto mb-4 text-[#3ecf8e]" />
          <h2 className="text-[24px] leading-[1.33] font-normal mb-4 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", letterSpacing: "-0.16px" }}>
            Ask AI about {areaData.name}
          </h2>
          <p className="text-[16px] text-[#b4b4b4] mb-6 max-w-xl mx-auto" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            Get personalized recommendations, budget tips, and insider knowledge about living and working in {areaData.name}.
          </p>
          <Link href={`/assistant?q=Tell me about living in ${areaData.name}`}>
            <Button
              className="text-[#fafafa] bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 rounded-full px-8"
              style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
            >
              <MessageCircle size={16} className="mr-2" />
              Ask AI about {areaData.name}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
