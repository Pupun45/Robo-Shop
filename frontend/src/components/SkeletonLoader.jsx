// src/components/SkeletonLoader.jsx
import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="border border-gray-250 rounded-[2rem] p-5 flex flex-col justify-between h-full bg-white shadow-sm animate-pulse space-y-4">
      {/* Image Placeholder */}
      <div className="bg-gray-200 rounded-2xl h-48 w-full"></div>
      
      {/* Details Placeholder */}
      <div className="flex-grow space-y-3">
        {/* Category tag */}
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
      
      {/* Price & Action Placeholder */}
      <div className="pt-3 border-t border-gray-100 space-y-3 mt-auto">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-6 md:p-10 lg:flex lg:space-x-10">
        
        {/* Image & Thumbnails Left Column */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-6 mb-6 lg:mb-0 space-y-4">
          <div className="w-full h-80 md:h-[480px] bg-gray-200 rounded-xl"></div>
          <div className="flex space-x-2">
            <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
            <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
            <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
          </div>
        </div>

        {/* Text Right Column */}
        <div className="lg:w-1/2 space-y-6 py-4">
          {/* Category */}
          <div className="h-4 bg-gray-250 rounded w-1/4"></div>
          {/* Title */}
          <div className="h-10 bg-gray-250 rounded w-3/4"></div>
          {/* Price */}
          <div className="h-8 bg-gray-250 rounded w-1/3"></div>
          
          {/* Description overview */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-3.5 bg-gray-200 rounded w-full"></div>
              <div className="h-3.5 bg-gray-200 rounded w-full"></div>
              <div className="h-3.5 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-6">
            <div className="h-12 bg-gray-250 rounded-xl w-full"></div>
            <div className="h-12 bg-gray-250 rounded-xl w-full"></div>
          </div>
        </div>

      </div>
    </div>
  );
};
