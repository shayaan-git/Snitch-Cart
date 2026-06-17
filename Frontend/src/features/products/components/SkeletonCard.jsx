import React from "react";

const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-sm overflow-hidden animate-pulse">
    <div className="w-full aspect-[4/3] bg-gray-100" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="space-y-1.5">
        <div className="h-2.5 bg-gray-100 rounded w-full" />
        <div className="h-2.5 bg-gray-100 rounded w-5/6" />
        <div className="h-2.5 bg-gray-100 rounded w-2/3" />
      </div>
      <div className="flex justify-between pt-3 border-t border-gray-100">
        <div className="h-4 bg-gray-100 rounded w-1/4" />
        <div className="h-2.5 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
