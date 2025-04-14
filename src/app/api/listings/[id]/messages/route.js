import dbConnect from "@/utils/db";
import Listing from "@/models/listing";
import { authenticate } from "@/middleware/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET messages for a specific listing
export async function GET(request, { params }) {
  await dbConnect();
  
  try {
    // Authenticate the user
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;
    
    const { id } = params;
    const userId = request.user.id;
    
    // Find the listing and its messages
    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }
    
    // Extract messages related to this user
    const messages = listing.messages?.filter(msg => 
      msg.userId.toString() === userId || listing.host.toString() === userId
    ) || [];
    
    return NextResponse.json({
      listingId: id,
      listingName: listing.name,
      hostId: listing.host,
      messages
    });
  } catch (error) {
    console.error("Error fetching listing messages:", error);
    return NextResponse.json(
      { error: "Unable to fetch messages" },
      { status: 500 }
    );
  }
}

// POST a new message to a listing
export async function POST(request, { params }) {
  await dbConnect();
  
  try {
    // Authenticate the user
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;
    
    const { id } = params;
    const userId = request.user.id;
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }
    
    // Find the listing
    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }
    
    // Check if messages array exists, create if not
    if (!listing.messages) {
      listing.messages = [];
    }
    
    // Create new message object
    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(userId),
      content,
      createdAt: new Date(),
      read: false
    };
    
    // Add message to listing
    listing.messages.push(newMessage);
    await listing.save();
    
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error adding message to listing:", error);
    return NextResponse.json(
      { error: "Unable to add message" },
      { status: 500 }
    );
  }
}