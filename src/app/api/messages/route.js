import dbConnect from "../../../utils/db";
import Message from "../../../models/message";
import { authenticate } from "../../../middleware/auth";

export async function GET(req) {
  await dbConnect();

  try {
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse;

    const userId = req.user.id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $gt: ["$sender", "$receiver"] },
              { sender: "$sender", receiver: "$receiver" },
              { sender: "$receiver", receiver: "$sender" },
            ],
          },
          lastMessage: { $last: "$content" },
          lastMessageTime: { $last: "$createdAt" },
          participants: { $addToSet: ["$sender", "$receiver"] },
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return new Response(JSON.stringify(conversations), { status: 200 });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new Response(
      JSON.stringify({ error: "Unable to fetch conversations" }),
      {
        status: 500,
      }
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
