"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthCheckProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthCheck({ children, fallback }: AuthCheckProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If the user is not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=" + encodeURIComponent(window.location.href));
    }
  }, [status, router]);

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show fallback or null if unauthenticated
  if (status === "unauthenticated") {
    return fallback || null;
  }

  // Show children if authenticated
  return <>{children}</>;
}