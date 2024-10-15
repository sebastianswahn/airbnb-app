import dbConnect from "../../../utils/db";
import Review from "../../../models/review";

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
    const body = await req.json();
    const newReview = new Review(body);
    await newReview.save();
    return new Response(JSON.stringify(newReview), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to create review" }), {
      status: 500,
    });
  }
}
