import dbConnect from "../../../../utils/db";
import Message from "../../../../models/message";
import { authenticate } from "../../../../middleware/auth";

export async function POST(req) {
  await dbConnect();

  try {
    const authResponse = await authenticate(req);
    if (authResponse) return authResponse;

    const senderId = req.user.id;
    const { receiverId } = await req.json();

    if (!receiverId) {
      return new Response(JSON.stringify({ error: "Receiver is required" }), {
        status: 400,
      });
    }

    const messages = await Message.find({
      sender: { $in: [senderId, receiverId] },
      receiver: { $in: [senderId, receiverId] },
    }).sort({ createdAt: 1 });

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(JSON.stringify({ error: "Unable to fetch messages" }), {
      status: 500,
    });
  }
}
