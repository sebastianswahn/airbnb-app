import dbConnect from "../../../utils/db";
import User from "../../../models/user";
import { generateToken } from "../../../utils/jwt";

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password } = await req.json(); // Parse the request body

    // Log email and password to check if they're being received
    console.log("Email from request:", email);
    console.log("Password from request:", password);

    // Find user by email
    const user = await User.findOne({ email });

    // Log user to check if it is being found correctly
    console.log("User found:", user);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Check if the password is correct
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    // Generate JWT token for the user
    const token = generateToken(user);

    return new Response(
      JSON.stringify({
        token,
        user: { id: user._id, email: user.email, role: user.role },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error); // Log the actual error for debugging
    return new Response(JSON.stringify({ error: "Error logging in" }), {
      status: 500,
    });
  }
}