// Path: src/pages/location-management/components/skeletons/DetailSkeleton.tsx

import React from "react";

const DetailSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full overflow-y-auto animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="h-7 w-48 bg-gray-300 rounded-md mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 mb-4">
        <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
        <div className="h-10 w-20 bg-gray-300 rounded-md"></div>
      </div>

      {/* Details */}
      <div className="border-t pt-4 space-y-3">
        <div className="h-5 w-24 bg-gray-300 rounded-md"></div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-28 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-36 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Usage */}
      <div className="border-t pt-4 mt-4 space-y-3">
        <div className="h-5 w-32 bg-gray-300 rounded-md"></div>
        <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
      </div>

      {/* Item List */}
      <div className="border-t pt-4 mt-4 space-y-3">
        <div className="h-5 w-40 bg-gray-300 rounded-md"></div>
        <div className="h-10 w-full bg-gray-200 rounded-md"></div>
        <div className="h-10 w-full bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
};

export default DetailSkeleton;
