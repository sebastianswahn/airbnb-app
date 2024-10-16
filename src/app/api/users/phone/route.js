import dbConnect from "../../../utils/db";
import User from "../../../models/user";
import { generateToken } from "../../../utils/jwt";

export async function POST(req) {
  await dbConnect();

  try {
    const { phone, otp } = await req.json(); // Receive phone number and OTP from request

    // Validate OTP (assume it's already sent to the user's phone)
    if (!validateOTP(phone, otp)) {
      return new Response(JSON.stringify({ error: "Invalid OTP" }), {
        status: 400,
      });
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
      await user.save();
    }

    const jwtToken = generateToken(user);

    return new Response(
      JSON.stringify({
        token: jwtToken,
        user: { id: user._id, phone: user.phone },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during phone login:", error);
    return new Response(
      JSON.stringify({ error: "Unable to login with phone" }),
      {
        status: 500,
      }
    );
  }
}

function validateOTP(phone, otp) {
  //  OTP validation logic here
  return true;
}
