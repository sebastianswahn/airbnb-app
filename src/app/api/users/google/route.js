import dbConnect from "../../../../utils/db";
import User from "../../../../models/user";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../../../../utils/jwt";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req) {
  await dbConnect();

  try {
    const { token } = await req.json(); // Get Google token from the request body

    // Logga vad som finns i GOOGLE_CLIENT_ID för att vara säker på att det är korrekt
    console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Logga vad som finns i payload för att se om audience stämmer överens
    console.log("Payload Audience:", payload.aud);
    console.log("Payload Google ID:", payload.sub);

    const { name, email, picture, sub: googleId } = payload;

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
    console.error("Error during Google authentication:", error.message); // Log the error
    return new Response(
      JSON.stringify({
        error: `Unable to authenticate with Google: ${error.message}`,
      }),
      {
        status: 500,
      }
    );
  }
}
