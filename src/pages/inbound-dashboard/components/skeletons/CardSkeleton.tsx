export const CardSkeleton = () => (
  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-4 animate-pulse">
    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
    <div className="flex-1 space-y-3 py-1">
      <div className="h-2 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);
