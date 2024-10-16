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
    // Authenticate the request and get the sender's (authenticated user's) ID from the token
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse; // Return the auth error if not authenticated

    const sender = req.user.id; // Authenticated user's ID extracted from the JWT token
    const { receiver, content } = await req.json(); // Parse the request body

    // Validate the input
    if (!receiver || !content) {
      return new Response(
        JSON.stringify({ error: "Receiver and content are required" }),
        { status: 400 }
      );
    }

    // Create a new message
    const newMessage = new Message({
      sender, // Automatically set the sender as the authenticated user
      receiver,
      content,
    });

    // Save the message to the database
    await newMessage.save();

    // Return the created message
    return new Response(JSON.stringify(newMessage), { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return new Response(JSON.stringify({ error: "Unable to create message" }), {
      status: 500,
    });
  }
}
