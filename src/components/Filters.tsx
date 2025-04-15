"use client";
import Image from "next/image";
import { useState } from "react";

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface FiltersProps {
  onChange?: (categoryId: string) => void;
}

export default function Filters({ onChange }: FiltersProps) {
  const [activeCategory, setActiveCategory] = useState<string>("amazing-views");

  const categories: Category[] = [
    {
      id: "amazing-views",
      label: "Amazing views",
      icon: "/images/categories/amazing-views.svg",
    },
    {
      id: "beachfront",
      label: "Beachfront",
      icon: "/images/categories/beachfront.svg",
    },
    {
      id: "countryside",
      label: "Countryside",
      icon: "/images/categories/countryside.svg",
    },
    {
      id: "iconic-cities",
      label: "Iconic cities",
      icon: "/images/categories/iconic-cities.svg",
    },
    // Add more categories as needed
  ];

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (onChange) {
      onChange(categoryId);
    }
  };

  return (
    <div className="overflow-x-auto py-2 -mx-6">
      <div className="flex gap-8 px-6 min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-6 h-6 mb-1">
              <Image
                src={category.icon}
                alt={category.label}
                width={24}
                height={24}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <span
              className={`text-xs whitespace-nowrap pb-2 ${
                activeCategory === category.id
                  ? "border-b-2 border-black font-medium"
                  : "text-gray-600"
              }`}
            >
              {category.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}