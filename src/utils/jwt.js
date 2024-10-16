import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

console.log("JWT Secret:", process.env.JWT_SECRET);

import jwt from "jsonwebtoken";

export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email || null,
      phone: user.phone || null,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
