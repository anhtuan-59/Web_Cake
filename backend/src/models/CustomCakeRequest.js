import mongoose from "mongoose";

const customCakeRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    size: String,
    shape: String,
    cakeFlavor: String,
    topping: String,
    colorTheme: String,
    priceMin: Number,
    priceMax: Number,
    deliveryDate: Date,
    note: String,
    status: {
      type: String,
      enum: ["pending", "quoted", "accepted", "rejected", "completed"],
      default: "pending",
    },
    aiSuggestedPrice: Number,
  },
  { timestamps: true }
);

export default mongoose.model("CustomCakeRequest", customCakeRequestSchema);
