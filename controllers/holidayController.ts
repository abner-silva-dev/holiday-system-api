import { NextFunction, Request, Response } from "express";
import Holiday from "../models/holidayModel";

import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";
import User from "../models/userModel";

export const getAllHoliday = getAll(Holiday);
export const getHoliday = getOne(Holiday);
export const createHoliday = createOne(Holiday);
export const deleteHoliday = deleteOne(Holiday);

export const updateHoliday = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await Holiday.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      throw new Error("Data doesn't exist");
    }

    if (
      data.authorizationAdmin === "approved" &&
      data.authorizationManager === "approved"
    ) {
      const user = await User.findById(data.user.id);

      // if (user) {
      //   user.credit = user.credit - data.days.length;
      //   console.log(user.credit);
      //   await user.save({ validateBeforeSave: true });
      // }
    }

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
};
