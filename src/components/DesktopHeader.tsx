"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IMAGES } from "@/constants/images";
import DesktopSearchBar from "./DesktopSearchBar";
import { useAuth } from "@/context/AuthContext";

const DesktopHeader = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="border-b border-gray-200 bg-white hidden md:block">
      <div className="max-w-[1360px] mx-auto px-6">
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={IMAGES.LOGO.AIRBNB}
              alt="Airbnb"
              width={102}
              height={32}
              priority
              className="cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>
          
          <div className="flex-1 max-w-md mx-12">
            <DesktopSearchBar />
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/host/homes")}
              className="text-sm font-medium hover:bg-gray-50 rounded-full px-4 py-2"
            >
              Airbnb your home
            </button>
            <div className="relative">
              <button 
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
              
              {/* Dropdown menu could go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;