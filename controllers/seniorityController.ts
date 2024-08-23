import SeniorityModel from "../models/seniorityModel";

import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";

export const getAllSeniority = getAll(SeniorityModel);
export const getSeniority = getOne(SeniorityModel);
export const createSeniority = createOne(SeniorityModel);
export const updateSeniority = updateOne(SeniorityModel);
export const deleteSeniority = deleteOne(SeniorityModel);
