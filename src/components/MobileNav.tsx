"use client";

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
  const unreadMessages = 2;

  const navItems: NavItem[] = [
    { icon: IMAGES.ICONS.SEARCH, label: "Explore", href: "/" },
    { icon: IMAGES.ICONS.MAP, label: "Trips", href: "/trips" },
    {
      icon: IMAGES.ICONS.INBOX,
      label: "Inbox",
      href: "/inbox",
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
                  pathname === item.href ? "text-blue-500" : "text-gray-500"
                }
              />
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </div>
            <span
              className={`text-xs ${
                pathname === item.href ? "text-blue-500" : "text-gray-500"
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
