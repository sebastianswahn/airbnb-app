import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

console.log("JWT Secret:", process.env.JWT_SECRET);

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET, // Ensure JWT_SECRET is in your .env.local
    { expiresIn: "30d" } // Token expires in 30 days
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
