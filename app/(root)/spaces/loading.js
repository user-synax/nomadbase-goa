export default function Loading() {
  return (
    <div className="min-h-screen bg-[#171717] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-[#2e2e2e] rounded animate-pulse mb-3" />
          <div className="h-5 w-96 bg-[#2e2e2e] rounded animate-pulse" />
        </div>

        {/* Grid Skeleton - 6 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#171717] rounded-[8px] border border-[#2e2e2e] overflow-hidden">
              <div className="aspect-video bg-[#242424] animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-7 w-32 bg-[#2e2e2e] rounded animate-pulse" />
                  <div className="h-6 w-16 bg-[#242424] rounded-full animate-pulse" />
                </div>
                <div className="h-5 w-24 bg-[#2e2e2e] rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-[#242424] rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-[#242424] rounded-full animate-pulse" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#242424]">
                  <div className="h-6 w-20 bg-[#2e2e2e] rounded animate-pulse" />
                  <div className="h-5 w-16 bg-[#2e2e2e] rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}