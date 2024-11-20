import dbConnect from "../../../../utils/db";
import Listing from "../../../../models/listing";

export async function GET(req) {
  await dbConnect();

  const {
    location,
    minPrice,
    maxPrice,
    sortBy,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    const query = {};

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortBy.startsWith("-") ? -1 : 1; 
    } else {
      sortOptions.price = 1;
    }

    const listings = await Listing.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortOptions);

    return new Response(JSON.stringify(listings), { status: 200 });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return new Response(JSON.stringify({ error: "Unable to fetch listings" }), {
      status: 500,
    });
  }
}
