"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { IMAGES } from "@/constants/images";

interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

export default function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  
  // Fetch unread message count
  useEffect(() => {
    // Skip fetch if not authenticated
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;
    
    async function fetchUnreadCount() {
      try {
        const response = await fetch("/api/conversations/unread");
        
        if (response.ok) {
          const data = await response.json();
          setUnreadMessages(data.unreadCount || 0);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    }
    
    // Fetch initially
    fetchUnreadCount();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const navItems: NavItem[] = [
    { icon: IMAGES.ICONS.SEARCH, label: "Explore", href: "/" },
    { icon: IMAGES.ICONS.MAP, label: "Trips", href: "/trips" },
    {
      icon: IMAGES.ICONS.INBOX,
      label: "Messages",
      href: "/messages",
      badge: unreadMessages,
    },
    { icon: IMAGES.ICONS.USER, label: "Profile", href: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-4 py-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className="flex flex-col items-center gap-1"
          >
            <div className="relative">
              <Image
                src={item.icon}
                alt={item.label}
                width={24}
                height={24}
                className={
                  pathname === item.href || 
                  (item.href === "/messages" && pathname?.includes("/listings") && pathname?.includes("/messages"))
                    ? "text-blue-500" 
                    : "text-gray-500"
                }
              />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 bg-blue-500 rounded-full text-white text-xs">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </div>
            <span
              className={`text-xs ${
                pathname === item.href || 
                (item.href === "/messages" && pathname?.includes("/listings") && pathname?.includes("/messages"))
                  ? "text-blue-500" 
                  : "text-gray-500"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}