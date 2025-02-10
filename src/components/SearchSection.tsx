"use client";

import { useState } from "react";
import Image from "next/image";

const categoryItems = [
  { id: "amazing-views", icon: "/view-icon.png", label: "Amazing views" },
  { id: "beachfront", icon: "/view-icon.png", label: "Beachfront" },
  { id: "countryside", icon: "/view-icon.png", label: "Countryside" },
  { id: "iconic-cities", icon: "/iconic.png", label: "Iconic cities" },
];

export default function SearchSection() {
  const [activeCategory, setActiveCategory] = useState("amazing-views");

  return (
    <section className="md:hidden block mt-7 max-w-[390px] mx-auto px-6 w-full">
      <div className="relative border border-solid mb-4 border-black/8 py-[9.5px] bg-white shadow-4xl rounded-[1000px] pl-[54px]">
        <button className="w-full text-left">Anywhere</button>
        <Image
          src="/small-search.svg"
          alt="Search"
          width={20}
          height={20}
          className="absolute left-5 top-1/2 -translate-y-1/2"
        />
        <button
          className="rounded-full absolute top-1/2 right-2.5 flex items-center justify-center h-9 -translate-y-1/2 max-w-9 w-full border border-grey-600 border-solid"
          aria-label="Filter"
        >
          <Image src="/filter-icon.svg" alt="Filter" width={16} height={16} />
        </button>
      </div>

      <div className="flex space-x-6 overflow-x-auto">
        {categoryItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveCategory(item.id)}
            className="flex flex-col items-center min-w-[64px]"
          >
            <div
              className={`pb-3 ${
                activeCategory === item.id
                  ? "border-b-[2px] border-solid border-black"
                  : ""
              }`}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={24}
                height={24}
                className="mx-auto"
              />
              <span
                className={`text-xs font-semibold font-roboto ${
                  activeCategory === item.id ? "text-black" : "text-grey-700"
                }`}
              >
                {item.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
