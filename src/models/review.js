import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: function () {
      return !this.host;
    },
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return !this.listing;
    },
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  text: String,
});
export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
