import dbConnect from "@/utils/db";
import Listing from "@/models/listing";
import { authenticate } from "@/middleware/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  await dbConnect();
  
  try {
    // Authenticate the user
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;
    
    const userId = request.user.id;
    
    // Find all listings where:
    // 1. User is the host, OR
    // 2. User has sent messages to this listing
    const listings = await Listing.find({
      $or: [
        { host: userId },
        { "messages.userId": userId }
      ]
    }, "name host messages");
    
    // Transform to conversation summaries
    const conversations = listings.map(listing => {
      // Filter messages involving this user
      const relevantMessages = listing.messages?.filter(msg => 
        msg.userId.toString() === userId || listing.host.toString() === userId
      ) || [];
      
      // Sort by date (most recent first)
      relevantMessages.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // Count unread messages
      const unreadCount = relevantMessages.filter(msg => 
        !msg.read && msg.userId.toString() !== userId
      ).length;
      
      // Get the latest message
      const latestMessage = relevantMessages.length > 0 ? relevantMessages[0] : null;
      
      return {
        listingId: listing._id,
        listingName: listing.name,
        hostId: listing.host,
        latestMessage: latestMessage ? {
          content: latestMessage.content,
          createdAt: latestMessage.createdAt,
          isFromUser: latestMessage.userId.toString() === userId
        } : null,
        unreadCount,
        messageCount: relevantMessages.length
      };
    });
    
    // Filter out listings with no messages
    const activeConversations = conversations.filter(conv => conv.messageCount > 0);
    
    return NextResponse.json(activeConversations);
  } catch (error) {
    console.error("Error fetching user conversations:", error);
    return NextResponse.json(
      { error: "Unable to fetch conversations" },
      { status: 500 }
    );
  }
}