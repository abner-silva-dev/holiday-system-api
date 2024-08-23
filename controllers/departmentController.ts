import DepartmentModel from "../models/departmentModel";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";

export const getAllDepartment = getAll(DepartmentModel);
export const getDepartment = getOne(DepartmentModel);
export const createDepartment = createOne(DepartmentModel);
export const updateDepartment = updateOne(DepartmentModel);
export const deleteDepartment = deleteOne(DepartmentModel);
