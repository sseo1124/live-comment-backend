import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

import { createUser, findOneUserbyEmail } from "../repositories/user-repo.js";
import { ERROR_MESSAGE } from "../config/constants.js";

export async function siginup(req, res, next) {
  try {
    const { email, password, name } = req.body;
    const newUser = await createUser({ email, password, name });

    return res.status(201).json({
      user: { id: newUser._id, email: newUser.email, name: newUser.name },
    });
  } catch {
    next(createHttpError(400, ERROR_MESSAGE.REGISTER_ERROR));
  }
}

export async function login(req, res, next) {
  const { email, password } = req.body;

  const user = await findOneUserbyEmail(email);

  if (!user) {
    return next(createHttpError(404, ERROR_MESSAGE.USER_NOT_FOUND));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(createHttpError(401, ERROR_MESSAGE.PASSWORD_ERROR));
  }

  const accessToken = generateAccessToken(user);

  return res.json({
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  });
}

function generateAccessToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    name: user.name,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
}
