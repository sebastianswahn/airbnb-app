"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IMAGES } from "@/constants/images";

interface MobileSearchBarProps {
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
}

export default function MobileSearchBar({ 
  onSearch,
  onFilterClick 
}: MobileSearchBarProps) {
  const router = useRouter();

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch("search");
    } else {
      router.push("/search");
    }
  };

  const handleFilterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFilterClick) {
      onFilterClick();
    } else {
      router.push("/search");
    }
  };

  return (
    <div className="px-6 py-2">
      <button
        className="w-full flex items-center gap-4 shadow-sm bg-white rounded-full border border-gray-200 py-2.5 pl-4 pr-2.5"
        onClick={handleSearchClick}
      >
        <div className="flex items-center gap-3">
          <Image src={IMAGES.ICONS.SEARCH} alt="Search" width={18} height={18} />
          <div>
            <div className="text-[15px] font-medium text-left">Anywhere</div>
            <div className="text-[13px] text-gray-500">Any week · Add guests</div>
          </div>
        </div>
        <div className="ml-auto p-1.5 border rounded-full" onClick={handleFilterClick}>
          <Image src={IMAGES.ICONS.FILTER} alt="Filters" width={16} height={16} />
        </div>
      </button>
    </div>
  );
}