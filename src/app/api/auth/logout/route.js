import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Get the cookie store
    const cookieStore = cookies();
    
    // Clear the auth token cookie
    cookieStore.delete("authToken");
    
    // Return success response
    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Error during logout" },
      { status: 500 }
    );
  }
}