import Image from "next/image";
import { useState } from "react";

const categories = [
  {
    id: "amazing-views",
    label: "Amazing views",
    icon: "/images/categories/amazing-views.svg", // Updated path
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
    icon: "/images/categories/iconic-cities.svg", // Updated path
  },
];
export default function Filters() {
  const [activeCategory, setActiveCategory] = useState("amazing-views");

  return (
    <div className="overflow-x-auto py-2">
      <div className="flex gap-8 min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-6 h-6">
              {" "}
              {/* Fixed size container */}
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
              className={`text-xs ${
                activeCategory === category.id
                  ? "border-b-2 border-black pb-2"
                  : ""
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
