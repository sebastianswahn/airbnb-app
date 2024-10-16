import dbConnect from "../../../utils/db";
import User from "../../../models/user";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../../../utils/jwt";
import dotenv from "dotenv";
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req) {
  await dbConnect();

  try {
    const { token } = await req.json(); // Get Google token from the request body

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub: googleId } = ticket.getPayload(); // Extract user info

    // Check if the user already exists
    let user = await User.findOne({ googleId });
    if (!user) {
      // Create a new user if they don't exist
      user = new User({
        name,
        email,
        googleId,
        avatar: picture,
      });
      await user.save();
    }

    // Generate JWT for the user
    const jwtToken = generateToken(user);

    return new Response(
      JSON.stringify({
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during Google authentication:", error);
    return new Response(
      JSON.stringify({ error: "Unable to authenticate with Google" }),
      {
        status: 500,
      }
    );
  }
}
