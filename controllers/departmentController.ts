import Department from "../models/departmentModel";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";

export const getAllDepartment = getAll(Department);
export const getDepartment = getOne(Department);
export const createDepartment = createOne(Department);
export const updateDepartment = updateOne(Department);
export const deleteDepartment = deleteOne(Department);
