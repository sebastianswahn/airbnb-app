// app/api/conversations/listing/[id]/route.js
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

export async function GET(request, { params }) {
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

    const listingId = params.id;

    await dbConnect();

    console.log("Looking for messages with listingId:", listingId, "and userId:", userId);

    // Find messages for this listing from this user
    let listingMessage = await ListingMessage.findOne({
      listingId,
      userId,
    });

    console.log("Found message thread:", listingMessage);

    // If messages exist, mark non-user messages as read
    if (listingMessage) {
      let needsUpdate = false;
      
      // Check for any unread non-user messages
      listingMessage.messages.forEach(message => {
        if (!message.isFromUser && !message.read) {
          message.read = true;
          needsUpdate = true;
        }
      });
      
      // Save if there were any updates
      if (needsUpdate) {
        await listingMessage.save();
        console.log("Marked messages as read");
      }
    }

    // If no messages exist yet, return an empty array
    if (!listingMessage) {
      return NextResponse.json({
        _id: null,
        listingId,
        listingName: "Listing",
        userId,
        userName: "User",
        messages: [],
      });
    }

    return NextResponse.json({
      _id: listingMessage._id,
      listingId,
      listingName: "Listing",
      userId,
      userName: "User",
      messages: listingMessage.messages,
    });
  } catch (error) {
    console.error("Error in GET /api/conversations/listing/[id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
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
    let userName = "User";
    try {
      // Verify the token
      const decoded = verifyToken(token);
      userId = decoded.id;
      userName = decoded.name || "User";
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 403 }
      );
    }

    const listingId = params.id;
    
    let message;
    try {
      const body = await request.json();
      message = body.message;
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    console.log("Saving message from userId:", userId, "to listingId:", listingId);
    console.log("Message content:", message);

    // Create a new message
    const newMessage = {
      content: message.trim(),
      userId,
      userName,
      isFromUser: true,
      createdAt: new Date(),
      read: true, // User's own messages are always read
    };

    console.log("New message object:", newMessage);

    // Find or create a message thread
    let listingMessage;
    try {
      listingMessage = await ListingMessage.findOne({
        listingId,
        userId,
      });

      console.log("Existing thread found:", listingMessage ? "Yes" : "No");

      if (!listingMessage) {
        // Create new message thread
        console.log("Creating new thread");
        listingMessage = await ListingMessage.create({
          listingId,
          userId,
          messages: [newMessage],
        });
        console.log("New thread created with ID:", listingMessage._id);
      } else {
        // Add message to existing thread
        console.log("Adding to existing thread");
        listingMessage.messages.push(newMessage);
        await listingMessage.save();
        console.log("Message added to thread");
      }
    } catch (err) {
      console.error("Error saving message:", err);
      return NextResponse.json(
        { error: "Failed to save message", details: err.message },
        { status: 500 }
      );
    }

    // Add an automated response from the listing
    setTimeout(async () => {
      try {
        // Find the message thread again
        const updatedThread = await ListingMessage.findOne({
          listingId,
          userId,
        });
        
        if (updatedThread) {
          const autoResponse = {
            content: `Thank you for your message. We've received your inquiry and will get back to you soon.`,
            userId,
            userName: "Jane Smith (Host)",
            isFromUser: false,
            createdAt: new Date(),
            read: false,  // Auto-response is unread by default
          };
          
          updatedThread.messages.push(autoResponse);
          await updatedThread.save();
          console.log("Automated response added");
        }
      } catch (error) {
        console.error("Error sending automated response:", error);
      }
    }, 10000); // 10-second delay for the automated response

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      listingMessage: {
        _id: listingMessage._id,
        listingId,
        userId,
        userName,
        messages: listingMessage.messages,
      }
    });
  } catch (error) {
    console.error("Error in POST /api/conversations/listing/[id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}