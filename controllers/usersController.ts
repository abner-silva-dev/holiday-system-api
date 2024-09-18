import User from "../models/userModel";

import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";

export const getAllUser = getAll(User, { path: "holidays" });
export const getUser = getOne(User, { path: "holidays" });
export const createUser = createOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
