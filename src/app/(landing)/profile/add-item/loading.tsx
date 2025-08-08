import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Loading() {
    return (
        <div className="container min-h-screen mx-auto px-4 py-8 mt-20">
            <div className="flex justify-between items-center mb-8">
                <Skeleton width={200} height={40} />
                <Skeleton width={120} height={40} />
            </div>

            <div className="bg-surface-primary rounded-xl p-6 w-full max-w-4xl mx-auto space-y-6">
                {/* Item Name */}
                <div>
                    <Skeleton width={100} height={20} className="mb-2" />
                    <Skeleton height={48} />
                </div>

                {/* Description */}
                <div>
                    <Skeleton width={100} height={20} className="mb-2" />
                    <Skeleton height={120} />
                </div>

                {/* Condition */}
                <div>
                    <Skeleton width={100} height={20} className="mb-2" />
                    <Skeleton height={48} />
                </div>

                {/* Quantity and Location Radius */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Skeleton width={100} height={20} className="mb-2" />
                        <Skeleton height={48} />
                    </div>
                </div>

                {/* Photos */}
                <div>
                    <Skeleton width={100} height={20} className="mb-2" />
                    <Skeleton height={150} />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} height={96} />
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                    <Skeleton width={120} height={48} />
                    <Skeleton width={150} height={48} />
                </div>
            </div>
        </div>
    );
}