import dbConnect from "../../../utils/db";
import User from "../../../models/user";
import fetch from "node-fetch";
import { generateToken } from "../../../utils/jwt";

export async function POST(req) {
  await dbConnect();

  try {
    const { accessToken } = await req.json();

    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`
    );
    const fbData = await response.json();

    if (!fbData || !fbData.id) {
      return new Response(JSON.stringify({ error: "Invalid Facebook token" }), {
        status: 400,
      });
    }

    const { id: facebookId, name, email, picture } = fbData;

    let user = await User.findOne({ facebookId });
    if (!user) {
      user = new User({
        name,
        email,
        facebookId,
        avatar: picture?.data?.url || "",
      });
      await user.save();
    }

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
    console.error("Error during Facebook authentication:", error);
    return new Response(
      JSON.stringify({ error: "Unable to authenticate with Facebook" }),
      {
        status: 500,
      }
    );
  }
}
