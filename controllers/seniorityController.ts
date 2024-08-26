import Seniority from "../models/seniorityModel";

import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";

export const getAllSeniority = getAll(Seniority);
export const getSeniority = getOne(Seniority);
export const createSeniority = createOne(Seniority);
export const updateSeniority = updateOne(Seniority);
export const deleteSeniority = deleteOne(Seniority);
