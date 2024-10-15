import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  location: String,
  price: { type: Number, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Värd
});

export default mongoose.models.Listing ||
  mongoose.model("Listing", ListingSchema);
