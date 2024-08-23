import HolidayModel from "../models/holidayModel";

import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";

export const getAllHoliday = getAll(HolidayModel);
export const getHoliday = getOne(HolidayModel);
export const createHoliday = createOne(HolidayModel);
export const updateHoliday = updateOne(HolidayModel);
export const deleteHoliday = deleteOne(HolidayModel);
