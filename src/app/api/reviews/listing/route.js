import dbConnect from "../../../../utils/db";
import Review from "../../../../models/review";

export async function GET(req) {
  await dbConnect();

  try {
    // Hämta listingId från request URL (URLSearchParams)
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get("listingId"); // Hämtar listingId från query-parametern

    // Kontrollera att listingId är angivet
    if (!listingId) {
      return new Response(JSON.stringify({ error: "Listing ID is required" }), {
        status: 400,
      });
    }

    // Hämta recensionerna för den angivna listingId
    const reviews = await Review.find({ listing: listingId });
    return new Response(JSON.stringify(reviews), { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return new Response(JSON.stringify({ error: "Unable to fetch reviews" }), {
      status: 500,
    });
  }
}
