import Enterprise from "../models/enterpriseModel";

import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";

export const getAllEnterprise = getAll(Enterprise);
export const getEnterprise = getOne(Enterprise);
export const createEnterprise = createOne(Enterprise);
export const updateEnterprise = updateOne(Enterprise);
export const deleteEnterprise = deleteOne(Enterprise);
