import { verifyToken, TokenPayload } from "../utils/jwt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "@/models/user"; // Import User model
import dbConnect from "@/utils/db"; // Import database connection

// Extend the Request interface to include the user property
declare global {
  interface Request {
    user?: {
      id: string;
      email?: string;
      phone?: string;
      role?: string;
    };
  }
}

export async function authenticate(req: Request): Promise<NextResponse | null> {
  console.log("📝 Authenticating request");
  
  // Try to get token from cookie (primary method)
  let token: string | undefined;
  
  try {
    // Use Next.js cookies API
    const cookieStore = cookies();
    token = cookieStore.get("authToken")?.value;
    
    if (token) {
      console.log("🍪 Found auth token in cookies");
    }
  } catch (e) {
    // Cookies API might not be available in all contexts
    console.log("Could not access cookies:", e);
  }
  
  // If no token in cookie, check Authorization header (fallback)
  if (!token) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      console.log("🔑 Found auth token in Authorization header");
    }
  }
  
  // If no token found in any location
  if (!token) {
    console.log("❌ No auth token found");
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }
  
  try {
    // Verify the token
    const decoded = verifyToken(token);
    console.log(`✅ Token verified for user ID: ${decoded.id}`);
    
    // Optional: Connect to database and verify user still exists
    // This adds more security but slightly more overhead
    try {
      await dbConnect();
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log(`❌ User with ID ${decoded.id} not found in database`);
        
        // Clear invalid cookie
        try {
          const cookieStore = cookies();
          cookieStore.delete("authToken");
        } catch (e) {
          // Ignore cookie deletion errors
        }
        
        return NextResponse.json(
          { error: "User not found" },
          { status: 401 }
        );
      }
    } catch (dbError) {
      // If DB check fails, still continue with token verification
      console.warn("DB verification skipped:", dbError);
    }
    
    // Attach user data to request
    req.user = {
      id: decoded.id,
      email: decoded.email === null ? undefined : decoded.email,
      phone: decoded.phone === null ? undefined : decoded.phone,
      role: decoded.role
    };
    
    // If everything is valid, return null to continue
    return null;
  } catch (error) {
    console.error("Token verification failed:", error);
    
    // Clear invalid cookie if possible
    try {
      const cookieStore = cookies();
      cookieStore.delete("authToken");
    } catch (e) {
      // Ignore cookie deletion errors
    }
    
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 403 }
    );
  }
}