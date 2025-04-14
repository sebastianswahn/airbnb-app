import dbConnect from "@/utils/db";
import Message from "@/models/message";
import User from "@/models/user"; // Assuming you have a User model
import { authenticate } from "@/middleware/auth";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  
  try {
    // Authenticate the user
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;
    
    const { receiverId } = await request.json();
    const senderId = request.user.id;
    
    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver ID is required" },
        { status: 400 }
      );
    }
    
    // Convert string IDs to ObjectIds
    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);
    
    // Find all messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: senderObjectId, receiver: receiverObjectId },
        { sender: receiverObjectId, receiver: senderObjectId }
      ]
    }).sort({ createdAt: 1 });
    
    // Mark unread messages as read (where current user is the receiver)
    const unreadMessages = messages
      .filter(msg => msg.receiver.toString() === senderId && !msg.read)
      .map(msg => msg._id);
      
    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessages } },
        { $set: { read: true } }
      );
    }
    
    // Try to get user details for both sender and receiver
    let receiverDetails = null;
    try {
      receiverDetails = await User.findById(receiverObjectId, 'name avatar');
    } catch (error) {
      console.log("Error fetching receiver details:", error);
    }
    
    // Return messages with conversation metadata
    return NextResponse.json({
      messages: messages,
      conversation: {
        participantId: receiverId,
        participantName: receiverDetails?.name || "User",
        participantAvatar: receiverDetails?.avatar || null,
      }
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Unable to fetch conversation" },
      { status: 500 }
    );
  }
}