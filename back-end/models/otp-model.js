import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
  email: { type: String, required: true, index: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const otpModel = mongoose.model("otps", otpSchema);
