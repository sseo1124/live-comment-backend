import createHttpError from "http-errors";
import { createUser } from "../repositories/user-repo.js";
import { ERROR_MESSAGE } from "../config/constants.js";

export async function siginup(req, res, next) {
  try {
    const { email, password, name } = req.body;
    const newUser = await createUser({ email, password, name });

    return res.status(201).json({
      user: { _id: newUser._id, email: newUser.email, name: newUser.name },
    });
  } catch {
    next(createHttpError(400, ERROR_MESSAGE.REGISTER_ERROR));
  }
}
