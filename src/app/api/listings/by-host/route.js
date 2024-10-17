import dbConnect from "../../../../utils/db";
import Listing from "../../../../models/listing";
import { authenticate } from "../../../../middleware/auth";

export async function POST(req) {
  await dbConnect();

  try {
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse;

    const { hostId } = await req.json();

    if (!hostId) {
      return new Response(JSON.stringify({ error: "Host ID is required" }), {
        status: 400,
      });
    }

    const listings = await Listing.find({ host: hostId });

    return new Response(JSON.stringify(listings), { status: 200 });
  } catch (error) {
    console.error("Error fetching listings for host:", error);
    return new Response(JSON.stringify({ error: "Unable to fetch listings" }), {
      status: 500,
    });
  }
}
