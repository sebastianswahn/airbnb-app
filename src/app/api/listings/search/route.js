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

    // Add case-insensitive partial match for location
    if (location) {
      query.location = { $regex: location, $options: "i" }; // Case-insensitive search
    }

    // Add price range filter if minPrice and/or maxPrice are provided
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    // Pagination (limit and skip)
    const skip = (page - 1) * limit;

    // Sorting (default by price, ascending)
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortBy.startsWith("-") ? -1 : 1; // Sort descending if prefixed with "-", otherwise ascending
    } else {
      sortOptions.price = 1; // Default sorting by price (ascending)
    }

    // Fetch listings based on query, pagination, and sorting
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
