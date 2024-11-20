// components/Layout.tsx
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="md:hidden">
        <MobileNav />
      </div>

      <div className="hidden md:block">
        <Header />
      </div>

      {children}

      <Footer />
    </>
  );
}
