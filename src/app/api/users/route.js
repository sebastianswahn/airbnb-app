import dbConnect from "../../../utils/db";
import User from "../../../models/user";
import bcrypt from "bcryptjs";

export async function GET(req) {
  await dbConnect();
  try {
    // Fetch all users from the User collection
    const users = await User.find(); // Fetch all users without any condition

    // If no users are found, return an appropriate response
    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ error: "No users found" }), {
        status: 404,
      });
    }

    // Return the list of users
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error); // Log the full error
    return new Response(
      JSON.stringify({ error: `Unable to fetch users: ${error.message}` }),
      {
        status: 500,
      }
    );
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

    // Hash the password manually before saving the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // Create the new user with the hashed password
    const newUser = new User({
      name: body.name,
      email: body.email,
      password: hashedPassword, // Store the hashed password
      role: body.role,
    });

    // Save the user to the database
    await newUser.save();

    // Return the created user, excluding the password from the response
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    return new Response(JSON.stringify(userResponse), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to create user" }), {
      status: 500,
    });
  }
}