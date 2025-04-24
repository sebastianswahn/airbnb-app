"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IMAGES } from "@/constants/images";
import { useAuth } from "@/context/AuthContext";

const DesktopHeader = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Combined search bar handling
  const handleSearchClick = () => {
    router.push("/search");
  };

  return (
    <div className="border-b border-gray-200 bg-white hidden md:block">
      <div className="max-w-[1360px] mx-auto px-6">
        <div className="py-4 flex items-center justify-between">
          {/* Logo */}
          <div onClick={() => router.push("/")} className="cursor-pointer">
            <Image
              src={IMAGES.LOGO.AIRBNB}
              alt="Airbnb"
              width={102}
              height={32}
              priority
            />
          </div>
          
          {/* Integrated Search Bar */}
          <div 
            className="flex items-center justify-between border rounded-full py-2 px-4 shadow-sm 
              hover:shadow-md transition cursor-pointer max-w-md"
            onClick={handleSearchClick}
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
          
          {/* Right side controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/host/homes")}
              className="text-sm font-medium hover:bg-gray-50 rounded-full px-4 py-2"
            >
              Airbnb your home
            </button>
            <button 
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 border rounded-full p-1.5 hover:shadow-md transition"
            >
              <Image
                src={IMAGES.ICONS.HAMBURGER}
                alt="Menu"
                width={14}
                height={14}
              />
              <div className="h-7 w-7 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={user?.avatar || IMAGES.ICONS.USER}
                  alt="Profile"
                  width={28}
                  height={28}
                  className="object-cover"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;