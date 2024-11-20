// components/Filters.tsx
import React from "react";

const Filters: React.FC = () => {
  return (
    <div className="flex space-x-4 mb-4">
      <button className="bg-gray-200 rounded-full px-4 py-2 text-sm">
        Type
      </button>
      <button className="bg-gray-200 rounded-full px-4 py-2 text-sm">
        Price Range
      </button>
      <button className="bg-gray-200 rounded-full px-4 py-2 text-sm">
        Rating
      </button>
    </div>
  );
};

export default Filters;
