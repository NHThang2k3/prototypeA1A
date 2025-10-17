// Path: src/pages/location-management/components/skeletons/TreeSkeleton.tsx

import React from "react";

const SkeletonItem = ({ indent = 0 }: { indent?: number }) => (
  <div
    className="flex items-center p-2"
    style={{ paddingLeft: `${indent * 1.5 + 1}rem` }}
  >
    <div className="w-5 h-5 bg-gray-200 rounded-sm mr-2"></div>
    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
  </div>
);

const TreeSkeleton = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm h-full overflow-y-auto animate-pulse">
      <div className="h-6 w-1/3 bg-gray-300 rounded-md mb-4"></div>
      <div className="space-y-1">
        <SkeletonItem />
        <SkeletonItem indent={1} />
        <SkeletonItem indent={2} />
        <SkeletonItem indent={2} />
        <SkeletonItem indent={1} />
        <SkeletonItem />
        <SkeletonItem />
      </div>
    </div>
  );
};

export default TreeSkeleton;
