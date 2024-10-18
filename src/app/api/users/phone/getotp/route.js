import dbConnect from "../../../../../utils/db";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // Laddar .env.local-filen

// Twilio-klient, använder dina miljövariabler för autentisering
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
  await dbConnect();

  try {
    const { phone } = await req.json(); // Få telefonnummer från förfrågan

    // Skicka OTP via Twilio
    const verification = await client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({ to: phone, channel: "sms" });

    return new Response(
      JSON.stringify({
        message: "OTP sent successfully",
        status: verification.status,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    return new Response(JSON.stringify({ error: "Unable to send OTP" }), {
      status: 500,
    });
  }
}
