import User from "../model/User.js";

export async function createUser(userData) {
  const { email, password } = userData;
  await User.create({ email, password });
}
