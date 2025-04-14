"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ClientAuthCheck({ children }: { children: React.ReactNode }) {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Only show the login prompt if auth is loaded and user is not authenticated
    if (!loading && !isAuthenticated) {
      setShowLoginPrompt(true);
    }
  }, [isAuthenticated, loading]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show a login prompt instead of redirecting
  if (showLoginPrompt) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Please log in to view messages</h2>
        <p className="text-gray-600 mb-6">
          You need to be logged in to view and send messages about this listing.
        </p>
        <div className="flex flex-col space-y-4">
          <Link 
            href="/login" 
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center"
          >
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 text-center"
          >
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  // Show children if authenticated
  return <>{children}</>;
}