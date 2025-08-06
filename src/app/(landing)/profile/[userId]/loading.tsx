import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Profile Header Skeleton */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                <div className="w-full md:w-1/3 lg:w-1/4">
                    <div className="card p-6 flex flex-col items-center">
                        <Skeleton circle width={128} height={128} className="mb-4" />
                        <Skeleton width={150} height={30} className="mb-2" />
                        <Skeleton width={100} height={20} className="mb-2" />
                        <Skeleton width={200} height={20} className="mb-4" />
                        <div className="flex gap-2 mt-4 w-full justify-center">
                            <Skeleton width={100} height={40} />
                            <Skeleton width={100} height={40} />
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-2/3 lg:w-3/4">
                    <div className="card p-6">
                        <Skeleton width={200} height={30} className="mb-6" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i}>
                                    <Skeleton width={120} height={20} className="mb-2" />
                                    <Skeleton width={180} height={24} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Section Skeleton */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton width={200} height={32} />
                    <Skeleton width={120} height={24} />
                </div>
            </div>

            {/* Swap Activity Skeleton */}
            <div>
                <Skeleton width={200} height={32} className="mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="card p-6">
                            <Skeleton width={180} height={28} className="mb-4" />
                            {[...Array(3)].map((_, j) => (
                                <div key={j} className="border-b border-accent-dark pb-3 mb-3">
                                    <Skeleton width={120} height={20} className="mb-1" />
                                    <Skeleton width={80} height={16} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}