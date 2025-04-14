import dbConnect from "@/utils/db";
import User from "@/models/user";
import { authenticate } from "@/middleware/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();
  
  try {
    // Authenticate the request
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse;
    
    // Get user ID from the authenticated request
    const userId = req.user.id;
    
    // Find the user in the database
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Return user data
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Unable to fetch user data" },
      { status: 500 }
    );
  }
}