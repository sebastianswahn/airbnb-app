"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface NavItem {
  name: string;
  icon: string;
  href: string;
  hasNotification?: boolean;
}

export default function MobileNav() {
  const pathname = usePathname();

  // Navigation items
  const navItems: NavItem[] = [
    { name: "Explore", icon: "ftr-icon1.svg", href: "/" },
    { name: "Trips", icon: "ftr-icon2.svg", href: "/trips" },
    { name: "Inbox", icon: "ftr-icon3.svg", href: "/messages", hasNotification: true },
    { name: "Profile", icon: "ftr-icon4.svg", href: "/profile" }
  ];

  // Check if a path is active
  const isActive = (path: string): boolean => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-white border-t md:hidden z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          
          return (
            <Link key={item.name} href={item.href} className="text-center">
              <div className="relative">
                <Image
                  src={`/images/${item.icon}`}
                  alt={item.name}
                  width={24}
                  height={24}
                  className="mx-auto mb-[7px]"
                />
                {item.hasNotification && (
                  <Image
                    src="/images/small-box.svg"
                    alt="Notification"
                    width={8}
                    height={8}
                    className="absolute -top-1 -right-2"
                  />
                )}
              </div>
              <span className={`text-xs ${active ? "text-blue-500" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}