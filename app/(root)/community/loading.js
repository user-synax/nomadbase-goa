export default function Loading() {
  return (
    <div className="min-h-screen bg-[#171717] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar Skeleton */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <div className="h-5 w-24 bg-[#2e2e2e] rounded animate-pulse mb-4" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-9 w-full bg-[#2e2e2e] rounded animate-pulse" />
                ))}
              </div>
              <div className="mt-8">
                <div className="h-5 w-16 bg-[#2e2e2e] rounded animate-pulse mb-4" />
                <div className="space-y-2">
                  <div className="h-9 w-full bg-[#2e2e2e] rounded animate-pulse" />
                  <div className="h-9 w-full bg-[#2e2e2e] rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="h-10 w-36 bg-[#2e2e2e] rounded animate-pulse" />
              <div className="h-10 w-36 bg-[#3ecf8e] rounded-[9999px] animate-pulse" />
            </div>

            {/* Thread List Skeleton - 5 cards */}
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-[#171717] border border-[#2e2e2e] rounded-[8px] p-6">
                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#2e2e2e] rounded-full animate-pulse" />
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-24 bg-[#2e2e2e] rounded animate-pulse" />
                      <div className="h-4 w-16 bg-[#2e2e2e] rounded animate-pulse" />
                      <div className="h-4 w-20 bg-[#2e2e2e] rounded animate-pulse" />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="h-6 w-3/4 bg-[#2e2e2e] rounded animate-pulse mb-2" />

                  {/* Body Preview */}
                  <div className="space-y-2 mb-3">
                    <div className="h-4 w-full bg-[#2e2e2e] rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-[#2e2e2e] rounded animate-pulse" />
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-[#2e2e2e] rounded-full animate-pulse" />
                    <div className="h-6 w-20 bg-[#2e2e2e] rounded-full animate-pulse" />
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-[#2e2e2e] rounded animate-pulse" />
                      <div className="h-4 w-6 bg-[#2e2e2e] rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-[#2e2e2e] rounded animate-pulse" />
                      <div className="h-4 w-6 bg-[#2e2e2e] rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-[#2e2e2e] rounded animate-pulse" />
                      <div className="h-4 w-8 bg-[#2e2e2e] rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}