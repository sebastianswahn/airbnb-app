import dbConnect from "../../../utils/db";
import Listing from "../../../models/listing";

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
    const body = await req.json();
    const newListing = new Listing(body);
    await newListing.save();
    return new Response(JSON.stringify(newListing), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to create listing" }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  await dbConnect();
  const { location, minPrice, maxPrice } = req.query;

  try {
    const query = {};
    if (location) query.location = location;
    if (minPrice) query.price = { $gte: minPrice };
    if (maxPrice) query.price = { ...query.price, $lte: maxPrice };

    const listings = await Listing.find(query);
    return new Response(JSON.stringify(listings), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to fetch listings" }), {
      status: 500,
    });
  }
}
