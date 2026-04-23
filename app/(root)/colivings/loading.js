export default function Loading() {
  return (
    <div className="min-h-screen bg-[#171717] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-[#2e2e2e] rounded animate-pulse mb-3" />
          <div className="h-5 w-64 bg-[#2e2e2e] rounded animate-pulse" />
        </div>

        {/* Grid Skeleton - 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#171717] rounded-[8px] border border-[#2e2e2e] overflow-hidden">
              {/* Image Skeleton */}
              <div className="h-48 bg-[#242424] animate-pulse" />
              
              {/* Content Skeleton */}
              <div className="p-4">
                {/* Header */}
                <div className="mb-3">
                  <div className="h-6 w-32 bg-[#2e2e2e] rounded animate-pulse mb-2" />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-[#242424] rounded-full animate-pulse" />
                    <div className="h-5 w-20 bg-[#242424] rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <div className="h-8 w-28 bg-[#2e2e2e] rounded animate-pulse" />
                </div>

                {/* Includes */}
                <div className="flex gap-2 mb-3">
                  <div className="h-5 w-14 bg-[#242424] rounded animate-pulse" />
                  <div className="h-5 w-16 bg-[#242424] rounded animate-pulse" />
                  <div className="h-5 w-12 bg-[#242424] rounded animate-pulse" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-3.5 h-3.5 bg-[#242424] rounded-full animate-pulse" />
                    ))}
                  </div>
                  <div className="h-4 w-8 bg-[#2e2e2e] rounded animate-pulse" />
                  <div className="h-3 w-16 bg-[#242424] rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}