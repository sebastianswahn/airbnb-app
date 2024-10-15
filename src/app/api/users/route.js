import dbConnect from "../../../utils/db";
import User from "../../../models/user";

export async function GET(req) {
  await dbConnect();
  try {
    const { email } = req.query; // Hämta användare baserat på e-post
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to fetch user" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    const newUser = new User(body);
    await newUser.save();
    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to create user" }), {
      status: 500,
    });
  }
}
