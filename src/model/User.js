import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { AUTHENTICATION } from "../config/constants.js";

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
    password: { type: String, required: true, minlength: 8 },
    name: String,
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(AUTHENTICATION.SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
