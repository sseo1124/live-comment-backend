import User from "../model/User.js";

export async function createUser(userData) {
  const { email, password, name } = userData;
  return await User.create({ email, password, name });
}

export async function findOneUserbyId(userId) {
  return await User.findById(userId);
}

export async function findOneUserbyEmail(userEmail) {
  return await User.findOne({ userEmail });
}
