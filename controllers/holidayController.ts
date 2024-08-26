import Holiday from "../models/holidayModel";

import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";

export const getAllHoliday = getAll(Holiday);
export const getHoliday = getOne(Holiday);
export const createHoliday = createOne(Holiday);
export const updateHoliday = updateOne(Holiday);
export const deleteHoliday = deleteOne(Holiday);
