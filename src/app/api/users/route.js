import dbConnect from "../../../utils/db";
import User from "../../../models/user";
import bcrypt from "bcryptjs";
import { generateToken } from "../../../utils/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  try {
    const { email, password } = await req.json();
    console.log("Email from request:", email);
    console.log("Password from request:", password);

    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user);

    // Set HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: "/",
    });

    // Return user info (token is also included to maintain backward compatibility)
    return NextResponse.json({
      token, // Keep token in response for backward compatibility
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        role: user.role 
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Error logging in" },
      { status: 500 }
    );
  }
}