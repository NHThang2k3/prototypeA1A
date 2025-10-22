// Path: src/pages/inventory-list/components/skeletons/TableSkeleton.tsx

export const TableSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow animate-pulse">
    {/* Header Skeleton */}
    <div className="flex justify-between items-center mb-6">
      <div className="h-8 bg-gray-200 rounded w-64"></div>
      <div className="flex space-x-2">
        <div className="h-10 bg-gray-200 rounded w-40"></div>
      </div>
    </div>

    {/* Table Content Skeleton */}
    <div className="w-full">
      <div className="flex bg-gray-50 p-4 rounded-t-lg">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex-1 h-6 bg-gray-200 rounded mx-2"></div>
        ))}
      </div>
      <div className="space-y-2 mt-2">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="flex items-center p-4 border-b border-gray-100"
          >
            {[...Array(10)].map((_, j) => (
              <div
                key={j}
                className="flex-1 h-6 bg-gray-200 rounded mx-2"
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);
