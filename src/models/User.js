// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true }, // hashed password

    profileImage: { type: String }, // from Cloudinary

    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
