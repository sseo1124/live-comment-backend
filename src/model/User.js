import mongoose from "mongoose";
import { VALIDATION } from "../config/constants.js";

const UserSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      match: VALIDATION.PHONE.PATTERN,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
