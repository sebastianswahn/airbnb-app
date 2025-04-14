import { NextResponse } from "next/server";
import dbConnect from "@/utils/db.js";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";

// Import mongoose
const mongoose = require('mongoose');

// Define the schema here to ensure it exists
const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  isFromUser: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const ListingMessageSchema = new mongoose.Schema(
  {
    listingId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

// Create the model
let ListingMessage;
try {
  // Try to get the existing model to avoid model overwrite error
  ListingMessage = mongoose.model('ListingMessage');
} catch (e) {
  // Model doesn't exist yet, so create it
  ListingMessage = mongoose.model('ListingMessage', ListingMessageSchema);
}

export async function GET(request) {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("authToken")?.value;

    // If no token found
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    let userId;
    try {
      // Verify the token
      const decoded = verifyToken(token);
      userId = decoded.id;
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 403 }
      );
    }

    await dbConnect();

    console.log("Fetching conversations for userId:", userId);

    // Find all conversations for this user
    const conversations = await ListingMessage.find({ userId })
      .sort({ updatedAt: -1 })
      .lean();

    console.log(`Found ${conversations.length} conversations`);

    // We need to get listing details for each conversation
    const Listing = mongoose.model('Listing');
    
    // Map to include listing details and last message
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        // Get listing details
        let listing;
        try {
          listing = await Listing.findById(conv.listingId).lean();
        } catch (err) {
          console.error(`Error fetching listing ${conv.listingId}:`, err);
          listing = null;
        }

        // Get last message
        const lastMessage = conv.messages.length > 0 
          ? conv.messages[conv.messages.length - 1] 
          : null;

        return {
          _id: conv._id.toString(),
          listingId: conv.listingId,
          listingName: listing ? listing.name : "Listing (deleted)",
          listingImage: listing && listing.images && listing.images.length > 0 ? listing.images[0] : null,
          messageCount: conv.messages.length,
          lastMessage: lastMessage ? lastMessage.content : null,
          lastMessageDate: lastMessage ? lastMessage.createdAt : null,
          isLastMessageFromUser: lastMessage ? lastMessage.isFromUser : false,
          updatedAt: conv.updatedAt
        };
      })
    );

    return NextResponse.json({
      conversations: conversationsWithDetails
    });
  } catch (error) {
    console.error("Error in GET /api/conversations:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}