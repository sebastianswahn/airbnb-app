"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IMAGES } from "@/constants/images";

const DesktopSearchBar = () => {
  const router = useRouter();
  const [searchActive, setSearchActive] = useState(false);

  const handleSearchClick = () => {
    router.push("/search");
  };

  return (
    <div 
      className={`flex items-center justify-between border rounded-full py-2 px-4 shadow-sm 
        hover:shadow-md transition cursor-pointer ${searchActive ? 'border-gray-400' : 'border-gray-200'}`}
      onClick={handleSearchClick}
      onMouseEnter={() => setSearchActive(true)}
      onMouseLeave={() => setSearchActive(false)}
    >
      <div className="text-sm font-medium">Anywhere</div>
      <div className="h-4 w-px bg-gray-300 mx-2"></div>
      <div className="text-sm font-medium">Any week</div>
      <div className="h-4 w-px bg-gray-300 mx-2"></div>
      <div className="text-sm text-gray-500">Add guests</div>
      <div className="bg-red-500 p-2 rounded-full ml-2">
        <Image
          src={IMAGES.ICONS.SEARCH || "/images/search.svg"}
          alt="Search"
          width={14}
          height={14}
          className="invert"
        />
      </div>
    </div>
  );
};

export default DesktopSearchBar;