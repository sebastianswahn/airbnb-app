import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Listing from "@/models/listing";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    await dbConnect();
    
    // Find distinct locations matching the search query
    // First, creating a case-insensitive regex pattern
    const searchRegex = new RegExp(query, 'i');
    
    // Find all distinct locations that match the query
    // Using aggregation to get unique locations
    const locations = await Listing.aggregate([
      // Filter by the search regex
      { $match: { location: searchRegex } },
      
      // Extract just the location field
      { $project: { location: 1, _id: 0 } },
      
      // Group by location to get unique values
      { $group: { _id: "$location" } },
      
      // Limit to 10 results
      { $limit: 10 },
      
      // Reshape for output
      { $project: { location: "$_id", _id: 0 } }
    ]);
    
    // Format the response
    const formattedLocations = locations.map(item => item.location);
    
    return NextResponse.json(formattedLocations);
  } catch (error) {
    console.error("Error searching locations:", error);
    return NextResponse.json(
      { error: "Error searching locations", details: error.message },
      { status: 500 }
    );
  }
}