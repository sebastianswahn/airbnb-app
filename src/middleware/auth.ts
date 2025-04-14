import { verifyToken, TokenPayload } from "../utils/jwt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
  // Try to get token from multiple sources
  let token: string | undefined;
  
  // 1. Check Authorization header (Bearer token)
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  
  // 2. If no token in header, check cookies (for browser requests)
  if (!token) {
    try {
      // Use Next.js cookies API
      const cookieStore = cookies();
      token = cookieStore.get("authToken")?.value;
    } catch (e) {
      // Cookies API might not be available in all contexts
      console.log("Could not access cookies:", e);
    }
  }
  
  // 3. Try to parse cookies manually if Next.js cookies API fails
  if (!token) {
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      // Parse cookies safely with proper typing
      const parsedCookies: Record<string, string> = {};
      cookieHeader.split(';').forEach(cookie => {
        const parts = cookie.trim().split('=');
        if (parts.length === 2) {
          const key = parts[0].trim();
          const value = parts[1].trim();
          parsedCookies[key] = value;
        }
      });
      
      token = parsedCookies.authToken;
    }
  }
  
  // If no token found in any location
  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }
  
  try {
    // Verify the token
    const decoded = verifyToken(token);
    
    // Convert the TokenPayload to the expected user type
    // This handles the null vs undefined type incompatibility
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
    
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 403 }
    );
  }
}