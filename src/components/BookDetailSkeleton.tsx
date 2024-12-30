import { Skeleton } from "@/components/ui/skeleton"

export default function BookDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-[1500px] mx-auto px-6 py-5">
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      <div className="pt-28 pb-16 px-6 md:px-8">
        <div className="max-w-[1500px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Cover Skeleton */}
            <div className="lg:w-1/3">
              <Skeleton className="aspect-[3/4] rounded-2xl w-full" />
            </div>

            {/* Details Skeleton */}
            <div className="lg:w-2/3 space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>

              <div className="border-t border-b py-8 space-y-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-24" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-14 w-full" />
              </div>

              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
