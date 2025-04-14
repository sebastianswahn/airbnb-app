import mongoose from "mongoose";

// Message sub-schema for storing messages directly in listings
const MessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

const ListingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  location: String,
  price: { type: Number, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  images: [{ type: String }],
  type: {
    type: String,
    enum: ["Villa", "Apartment", "House", "Bungalow", "Cabin"],
    required: true,
  },
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  maxGuests: { type: Number, default: 2 },
  amenities: [{ type: String }],
  coordinates: {
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    required: true,
  },
  rating: { type: Number, default: 0 },
  // Add messages array to store conversations
  messages: [MessageSchema]
});

export default mongoose.models.Listing ||
  mongoose.model("Listing", ListingSchema);