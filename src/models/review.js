import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  text: String,
});

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
