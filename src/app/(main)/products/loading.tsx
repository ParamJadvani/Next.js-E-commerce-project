import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Skeleton */}
                <div className="w-full md:w-1/4 lg:w-1/5 space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-6 w-full" />
                </div>
                {/* Product Grid Skeleton */}
                <div className="w-full md:w-3/4 lg:w-4/5">
                    <Skeleton className="h-8 w-1/2 mb-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="border rounded-lg p-4 space-y-3">
                                <Skeleton className="h-40 w-full" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-10 w-full mt-2" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
