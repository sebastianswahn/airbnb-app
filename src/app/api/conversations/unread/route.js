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
  },
  read: {
    type: Boolean,
    default: false,
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
        { unreadCount: 0 },
        { status: 200 }
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
        { unreadCount: 0 },
        { status: 200 }
      );
    }

    await dbConnect();

    // Find all conversations for this user
    const conversations = await ListingMessage.find({ userId });

    // Count unread messages (messages that are not from the user and not read)
    let unreadCount = 0;
    
    conversations.forEach(conversation => {
      conversation.messages.forEach(message => {
        if (!message.isFromUser && !message.read) {
          unreadCount++;
        }
      });
    });

    return NextResponse.json({
      unreadCount
    });
  } catch (error) {
    console.error("Error in GET /api/conversations/unread:", error);
    return NextResponse.json(
      { unreadCount: 0 },
      { status: 200 }
    );
  }
}