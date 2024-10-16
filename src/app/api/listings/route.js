import dbConnect from "../../../utils/db";
import Listing from "../../../models/listing";
import { authenticate } from "../../../middleware/auth"; // JWT authentication middleware

export async function GET(req) {
  await dbConnect();
  try {
    const listings = await Listing.find().populate("host");
    return new Response(JSON.stringify(listings), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to fetch listings" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse;

    const { id: userId, role } = req.user;

    if (role !== "host") {
      return new Response(
        JSON.stringify({ error: "Only hosts can create listings" }),
        {
          status: 403, // Forbidden
        }
      );
    }

    const body = await req.json();

    //validation
    const { name, description, location, price } = body;
    if (!name || !description || !location || !price) {
      return new Response(
        JSON.stringify({
          error: "Name, description, location, and price are required",
        }),
        { status: 400 } // Bad Request
      );
    }

    const newListing = new Listing({
      ...body,
      host: userId,
    });

    await newListing.save();

    return new Response(JSON.stringify(newListing), { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return new Response(JSON.stringify({ error: "Unable to create listing" }), {
      status: 500,
    });
  }
}
