import { verifyToken } from "../utils/jwt";

export async function authenticate(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return new Response(JSON.stringify({ error: "No token provided" }), {
      status: 401,
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 403,
    });
  }
}
