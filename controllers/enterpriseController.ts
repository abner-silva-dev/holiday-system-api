import EnterpriseModel from "../models/enterpriseModel";

import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";

export const getAllEnterprise = getAll(EnterpriseModel);
export const getEnterprise = getOne(EnterpriseModel);
export const createEnterprise = createOne(EnterpriseModel);
export const updateEnterprise = updateOne(EnterpriseModel);
export const deleteEnterprise = deleteOne(EnterpriseModel);
