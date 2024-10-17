import dbConnect from "../../../utils/db";
import Review from "../../../models/review";
import { authenticate } from "../../../middleware/auth";

export async function GET(req) {
  await dbConnect();
  try {
    const { listingId } = req.query;
    const reviews = await Review.find({ listing: listingId }).populate("user");
    return new Response(JSON.stringify(reviews), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to fetch reviews" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse;

    const userId = req.user.id;

    const { listing, host, rating, text } = await req.json();

    if (!listing && !host) {
      return new Response(
        JSON.stringify({ error: "Either listing or host must be specified." }),
        { status: 400 }
      );
    }

    if (listing && host) {
      return new Response(
        JSON.stringify({
          error: "Both listing and host cannot be specified together.",
        }),
        { status: 400 }
      );
    }

    const newReview = new Review({
      listing,
      host,
      user: userId,
      rating,
      text,
    });

    await newReview.save();

    return new Response(JSON.stringify(newReview), { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error); // Lägg till loggning
    return new Response(JSON.stringify({ error: "Unable to create review" }), {
      status: 500,
    });
  }
}
