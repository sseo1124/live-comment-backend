import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, minlength: 8 },
    name: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
