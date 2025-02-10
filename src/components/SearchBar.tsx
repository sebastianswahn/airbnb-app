import Image from "next/image";
import { IMAGES } from "@/constants/images";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="flex items-center gap-4 border rounded-full p-2 shadow-sm">
      <button className="flex items-center gap-3 pl-4">
        <Image src={IMAGES.ICONS.SEARCH} alt="Search" width={16} height={16} />
        <div className="text-left">
          <div className="text-sm font-medium">Anywhere</div>
          <div className="text-xs text-gray-500">Any week · Add guests</div>
        </div>
      </button>
    </div>
  );
}
