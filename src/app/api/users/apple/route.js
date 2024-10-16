import dbConnect from "../../../utils/db";
import User from "../../../models/user";
import jwt from "jsonwebtoken";
import { generateToken } from "../../../utils/jwt";
import { appleAuthVerify } from "../../../utils/apple";

export async function POST(req) {
  await dbConnect();

  try {
    const { idToken } = await req.json(); // Apple ID token sent from the frontend

    const decodedAppleToken = jwt.decode(idToken);

    if (!decodedAppleToken || !decodedAppleToken.sub) {
      return new Response(JSON.stringify({ error: "Invalid Apple token" }), {
        status: 400,
      });
    }

    const { sub: appleId, email, name } = decodedAppleToken;

    // Check if the user already exists in the database
    let user = await User.findOne({ appleId });
    if (!user) {
      // Create a new user if they don't exist
      user = new User({
        name, // Apple provides the name only on the first sign-in
        email, // Apple provides the email only on the first sign-in
        appleId,
      });
      await user.save();
    }

    const jwtToken = generateToken(user);

    return new Response(
      JSON.stringify({
        token: jwtToken,
        user: { id: user._id, name: user.name, email: user.email },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during Apple authentication:", error);
    return new Response(
      JSON.stringify({ error: "Unable to authenticate with Apple" }),
      {
        status: 500,
      }
    );
  }
}
