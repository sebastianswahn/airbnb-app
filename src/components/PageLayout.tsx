"use client";

import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileNav from "./MobileNav";
import DesktopHeader from "./DesktopHeader";

interface LayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
}

export default function PageLayout({ children, hideHeader = false }: LayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* Header for desktop - use DesktopHeader instead of Header */}
      {!hideHeader && !isMobile && (
        <div className="hidden md:block">
          <DesktopHeader />
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center pb-16 md:pb-0">
        {children}
      </div>
      
      {/* Mobile Navigation Bar - only on mobile */}
      {isMobile && <MobileNav />}
    </div>
  );
}