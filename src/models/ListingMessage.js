import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  isFromUser: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const ListingMessageSchema = new Schema(
  {
    listingId: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ListingMessageSchema.index({ listingId: 1, userId: 1 }, { unique: true });
ListingMessageSchema.index({ userId: 1 });

const ListingMessage = models.ListingMessage || model("ListingMessage", ListingMessageSchema);

export default ListingMessage;