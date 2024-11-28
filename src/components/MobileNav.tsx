"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MobileNav() {
  const [activeTab, setActiveTab] = useState("explore");

  return (
    <>
      {/* Top Navigation */}
      <nav className="md:hidden flex items-center justify-between px-6 py-4 border-b border-grey-600">
        <Link href="/">
          <Image src="/images/brand.svg" alt="Airbnb" width={82} height={25} />
        </Link>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-grey-100">
            <Image
              src="/images/search-icon.svg"
              alt="Search"
              width={20}
              height={20}
            />
          </button>
          <button className="relative">
            <Image src="/images/user.svg" alt="Menu" width={24} height={24} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="flex justify-around py-2">
          {[
            { name: "Explore", icon: "ftr-icon1.svg", path: "/" },
            { name: "Wishlists", icon: "ftr-icon2.svg", path: "/wishlists" },
            { name: "Trips", icon: "ftr-icon3.svg", path: "/trips" },
            {
              name: "Inbox",
              icon: "ftr-icon4.svg",
              path: "/inbox",
              hasNotification: true,
            },
            { name: "Profile", icon: "user.svg", path: "/profile" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center ${
                activeTab === item.name.toLowerCase()
                  ? "text-blue-600"
                  : "text-grey-700"
              }`}
              onClick={() => setActiveTab(item.name.toLowerCase())}
            >
              <div className="relative">
                <Image
                  src={`/images/${item.icon}`}
                  alt={item.name}
                  width={24}
                  height={24}
                />
                {item.hasNotification && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
