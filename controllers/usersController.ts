import UsersModel from "../models/usersModel";

import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";

export const getAllUser = getAll(UsersModel);
export const getUser = getOne(UsersModel);
export const createUser = createOne(UsersModel);
export const updateUser = updateOne(UsersModel);
export const deleteUser = deleteOne(UsersModel);
