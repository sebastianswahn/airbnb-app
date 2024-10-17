import dbConnect from "../../../utils/db";
import Message from "../../../models/message";
import { authenticate } from "../../../middleware/auth";
import mongoose from "mongoose";

export async function GET(req) {
  await dbConnect();

  try {
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse;

    const userId = new mongoose.Types.ObjectId(req.user.id);
    console.log("Authenticated User ID as ObjectId:", userId);

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    console.log("Messages found for user:", messages);

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    return new Response(
      JSON.stringify({
        error: `Unable to fetch messages: ${error.message}`,
      }),
      { status: 500 }
    );
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
