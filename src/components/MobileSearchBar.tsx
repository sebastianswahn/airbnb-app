import Image from "next/image";
import { IMAGES } from "@/constants/images";

interface MobileSearchBarProps {
  onSearch?: (query: string) => void;
}

export default function MobileSearchBar({ onSearch }: MobileSearchBarProps) {
  return (
    <button
      className="w-full flex items-center gap-4 shadow-sm bg-white rounded-full border border-gray-200 p-2.5"
      onClick={() => onSearch?.("search")}
    >
      <div className="flex items-center gap-3">
        <Image src={IMAGES.ICONS.SEARCH} alt="Search" width={18} height={18} />
        <div>
          <div className="text-[15px] font-medium text-left">Anywhere</div>
          <div className="text-[13px] text-gray-500">Any week · Add guests</div>
        </div>
      </div>
      <div className="ml-auto p-1.5 border rounded-full">
        <Image src={IMAGES.ICONS.FILTER} alt="Filters" width={16} height={16} />
      </div>
    </button>
  );
}
