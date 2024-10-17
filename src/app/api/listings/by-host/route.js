import dbConnect from "../../../utils/db";
import Listing from "../../../models/listing";

export async function GET(req) {
  await dbConnect();

  try {
    const { hostId } = req.query;

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
