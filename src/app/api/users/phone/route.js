import dbConnect from "@/utils/db";
import User from "@/models/user";
import { generateToken } from "@/utils/jwt";
import twilio from "twilio";
import dotenv from "dotenv";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

dotenv.config({ path: ".env.local" });

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
  await dbConnect();
  try {
    const { phone, otp } = await req.json();
    
    // Validate OTP
    const isValidOTP = await validateOTP(phone, otp);
    if (!isValidOTP) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }
    
    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ 
        phone,
        role: "guest" // Default role for new users
      });
      await user.save();
    }
    
    // Generate JWT token
    const jwtToken = generateToken(user);
    
    // Set the token as a cookie
    const cookieStore = cookies();
    cookieStore.set("authToken", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/"
    });
    
    // Return the response with token and user data
    return NextResponse.json({
      token: jwtToken,
      user: { 
        id: user._id, 
        phone: user.phone,
        role: user.role
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error during phone login or registration:", error);
    return NextResponse.json(
      { error: "Unable to login or register with phone" },
      { status: 500 }
    );
  }
}

async function validateOTP(phone, otp) {
  try {
    // For development, accept any OTP if specified in env
    if (process.env.NODE_ENV === "development" && process.env.ACCEPT_ANY_OTP === "true") {
      console.log("Development mode: Accepting any OTP");
      return true;
    }
    
    const verification = await client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: phone, code: otp });
    
    return verification.status === "approved";
  } catch (error) {
    console.error("Error validating OTP:", error);
    return false;
  }
}