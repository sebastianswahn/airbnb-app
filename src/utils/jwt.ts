import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

interface UserData {
  _id: string;
  email?: string;
  phone?: string;
  role?: string;
  [key: string]: any;
}

// Export the TokenPayload interface so it can be imported in auth.ts
export interface TokenPayload {
  id: string;
  email?: string | null;
  phone?: string | null;
  role?: string;
  iat?: number;
  exp?: number;
}

// Verify JWT_SECRET is defined
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables");
  // In a real application, you might want to throw an error here
}

/**
 * Generate a JWT token for a user
 * @param user User object containing _id and other properties
 * @returns JWT token string
 */
export function generateToken(user: UserData): string {
  return jwt.sign(
    {
      id: user._id,
      email: user.email || null,
      phone: user.phone || null,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" }
  );
}

/**
 * Verify and decode a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload
 */
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
};