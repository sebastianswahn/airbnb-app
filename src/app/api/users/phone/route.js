import dbConnect from "../../../../utils/db";
import User from "../../../../models/user";
import { generateToken } from "../../../../utils/jwt";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // Laddar .env.local-filen

// Twilio-klient
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
  await dbConnect();

  try {
    const { phone, otp } = await req.json(); // Få telefonnummer och OTP från förfrågan

    // Validera OTP genom Twilio Verify API
    const isValidOTP = await validateOTP(phone, otp);
    if (!isValidOTP) {
      return new Response(JSON.stringify({ error: "Invalid OTP" }), {
        status: 400,
      });
    }

    // Kolla om användaren redan finns i databasen baserat på telefonnummer
    let user = await User.findOne({ phone });
    if (!user) {
      // Skapa en ny användare om de inte finns, och sätt endast telefonnummer
      user = new User({ phone });
      await user.save();
    }

    // Generera JWT för användaren
    const jwtToken = generateToken(user);

    // Returnera JWT och användarinfo
    return new Response(
      JSON.stringify({
        token: jwtToken,
        user: { id: user._id, phone: user.phone },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during phone login or registration:", error.message);
    return new Response(
      JSON.stringify({ error: "Unable to login or register with phone" }),
      { status: 500 }
    );
  }
}

// Validera OTP med Twilio
async function validateOTP(phone, otp) {
  try {
    const verification = await client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: phone, code: otp });

    return verification.status === "approved";
  } catch (error) {
    console.error("Error validating OTP:", error.message);
    return false;
  }
}
