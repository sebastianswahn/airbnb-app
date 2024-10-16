import dbConnect from "../../../../utils/db";
import Message from "../../../../models/message";
import { authenticate } from "../../../../middleware/auth"; // JWT authentication middleware

export async function POST(req) {
  await dbConnect();

  try {
    // Authenticate the request and get the sender's (authenticated user's) ID from the token
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse; // Return the auth error if not authenticated

    const senderId = req.user.id; // Authenticated user's ID from the JWT token
    const { receiverId } = await req.json(); // Get receiverId from the request body

    if (!receiverId) {
      return new Response(JSON.stringify({ error: "Receiver is required" }), {
        status: 400,
      });
    }

    // Find messages between the authenticated user and the receiver
    const messages = await Message.find({
      sender: { $in: [senderId, receiverId] },
      receiver: { $in: [senderId, receiverId] },
    }).sort({ createdAt: 1 }); // Sort messages by creation time

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(JSON.stringify({ error: "Unable to fetch messages" }), {
      status: 500,
    });
  }
}
