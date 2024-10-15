import dbConnect from "../../../utils/db";
import Booking from "../../../models/booking";

export async function GET(req) {
  await dbConnect();
  try {
    const { userId } = req.query;
    const bookings = await Booking.find({ guest: userId }).populate("listing");
    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to fetch bookings" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const newBooking = new Booking(body);
    await newBooking.save();
    return new Response(JSON.stringify(newBooking), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to create booking" }), {
      status: 500,
    });
  }
}
