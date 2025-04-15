import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, generateToken } from "@/utils/jwt";
import User from "@/models/user";
import dbConnect from "@/utils/db";

export async function GET() {
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
      
      // Connect to database to verify user still exists
      await dbConnect();
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        // User no longer exists, clear the cookie
        cookieStore.delete("authToken");
        return NextResponse.json(
          { authenticated: false, message: "User not found" },
          { status: 401 }
        );
      }
      
      // Generate a fresh token to extend the session
      const newToken = generateToken(user);
      
      // Set a fresh cookie to extend the session
      cookieStore.set("authToken", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Changed from strict to lax for better compatibility
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
        path: "/",
      });
      
      // If token is valid, return success with user ID
      return NextResponse.json({
        authenticated: true,
        userId: decoded.id
      });
    } catch (error) {
      console.error("Token verification failed:", error);
      
      // Clear invalid cookie
      cookieStore.delete("authToken");
      
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