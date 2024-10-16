import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },
  appleId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ["guest", "host"], default: "guest" },
  avatar: { type: String },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
