import dbConnect from "../../../../utils/db";
import Review from "../../../../models/review";
import { authenticate } from "../../../../middleware/auth";

export async function GET(req) {
  await dbConnect();

  try {
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse;

    const hostId = req.nextUrl.searchParams.get("hostId");

    if (!hostId) {
      return new Response(JSON.stringify({ error: "Host ID is required" }), {
        status: 400,
      });
    }

    const reviews = await Review.find({ host: hostId }).populate({
      path: "user",
      select: "_id name",
    });

    return new Response(JSON.stringify(reviews), { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews for host:", error);
    return new Response(
      JSON.stringify({ error: "Unable to fetch host reviews" }),
      {
        status: 500,
      }
    );
  }
}
