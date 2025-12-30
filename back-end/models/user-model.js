import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, minLength: 4, required: true },
  name: { type: String, minLength: 3, required: true },
  role: { type: String, default: 'user' },
  status: { type: String, default: 'A' },
  verified: { type: Boolean, default: false },
  regdate: { type: Date, default: Date.now },

  travel: {
    type: {
      source: { type: String },
      destination: { type: String },
      departureTime: { type: Date },
      expiresAt: { type: Date }
    },
    default: null
  }

});

export const userModel = mongoose.model('users', userSchema);
