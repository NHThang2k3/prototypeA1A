// Path: src/pages/inventory-list/components/skeletons/FilterSkeleton.tsx

export const FilterSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow space-y-6 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    ))}
    <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
  </div>
);
