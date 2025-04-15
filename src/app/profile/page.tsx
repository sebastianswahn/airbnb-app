"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";

export default function SimpleProfile() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    console.log("🚪 Attempting to log out...");
    setLoggingOut(true);
    try {
      await logout();
      console.log("✅ Logout successful");
      // The AuthProvider's logout function handles the redirect
    } catch (error) {
      console.error("❌ Logout failed:", error);
      setLoggingOut(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <PageLayout>
        <div className="p-4 text-center w-full flex justify-center items-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div className="p-4 text-center w-full flex flex-col justify-center items-center h-[70vh]">
          <p className="text-xl mb-4">You need to log in to view your profile</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-2 px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="w-full h-full px-6 pb-16">

        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">Name</label>
            <p className="mt-1 text-lg">{user?.name || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-lg">{user?.email || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Phone</label>
            <p className="mt-1 text-lg">{user?.phone || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Role</label>
            <p className="mt-1 text-lg capitalize">{user?.role || "guest"}</p>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>User ID: {user?.id}</p>
        </div>
      </div>
    </PageLayout>
  );
}