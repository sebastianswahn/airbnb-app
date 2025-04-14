import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";

export async function GET(request) {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("authToken")?.value;

    // If no token found
    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: "No auth token found" },
        { status: 401 }
      );
    }

    try {
      // Verify the token
      const decoded = verifyToken(token);
      
      // If token is valid, return success
      return NextResponse.json({ 
        authenticated: true,
        userId: decoded.id
      });
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { authenticated: false, message: "Invalid or expired token" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}