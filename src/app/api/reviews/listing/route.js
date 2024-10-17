import dbConnect from "../../../../utils/db";
import Review from "../../../../models/review";
import { authenticate } from "../../../../middleware/auth";

export async function GET(req) {
  await dbConnect();

  try {
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse;

    const listingId = req.nextUrl.searchParams.get("listingId");

    if (!listingId) {
      return new Response(JSON.stringify({ error: "Listing ID is required" }), {
        status: 400,
      });
    }

    const reviews = await Review.find({ listing: listingId }).populate({
      path: "user",
      select: "_id name",
    });

    return new Response(JSON.stringify(reviews), { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews for listing:", error);
    return new Response(
      JSON.stringify({ error: "Unable to fetch listing reviews" }),
      {
        status: 500,
      }
    );
  }
}
