import dbConnect from "../../../utils/db";
import Message from "../../../models/message";
import { authenticate } from "../../../middleware/auth";

export async function GET(req) {
  await dbConnect();

  try {
    // Authenticate the request and get the user's (authenticated user's) ID from the token
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse; // Return the auth error if not authenticated

    const userId = req.user.id; // Authenticated user's ID from the JWT token

    // Find messages where the authenticated user is either the sender or the receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).sort({ createdAt: 1 }); // Sort messages by creation time

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(JSON.stringify({ error: "Unable to fetch messages" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse;

    const sender = req.user.id;
    const { receiver, content } = await req.json();

    // Validate the input
    if (!receiver || !content) {
      return new Response(
        JSON.stringify({ error: "Receiver and content are required" }),
        { status: 400 }
      );
    }

    const newMessage = new Message({
      sender,
      receiver,
      content,
    });

    await newMessage.save();

    return new Response(JSON.stringify(newMessage), { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return new Response(JSON.stringify({ error: "Unable to create message" }), {
      status: 500,
    });
  }
}
