"use client";

import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import Header from "./Header";
import MobileNav from "./MobileNav";

interface LayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
}

export default function PageLayout({ children, hideHeader = false }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* Header for desktop */}
      {!hideHeader && !isMobile && (
        <div className="hidden md:block">
          <Header />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center pt-4 md:pt-[80px] pb-16 md:pb-0">
        {children}
      </div>

      {/* Mobile Navigation Bar - only on mobile */}
      <MobileNav />
    </div>
  );
}