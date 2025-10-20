// Path: src/pages/inventory-list/components/skeletons/FilterSkeleton.tsx

export const FilterSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow animate-pulse">
    {/* Header Skeleton */}
    <div className="h-7 bg-gray-200 rounded w-full mb-6"></div>

    {/* Grid Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>

    {/* Buttons Skeleton */}
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="flex justify-end space-x-3">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  </div>
);
