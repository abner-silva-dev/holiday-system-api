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

export const getHoliday = getOne(Holiday);
export const deleteHoliday = deleteOne(Holiday);

// export const getAllHoliday = getAll(Holiday);

export const getAllHoliday = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let docs;
    if (req.user.role === "manager") {
      const users = await User.find({ department: req.user.department });
      const userIds = users.map((user) => user._id);
      docs = await Holiday.find({ user: { $in: userIds } });
    } else {
      docs = await Holiday.find({});
    }

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs,
    });
  } catch (err) {
    next(err);
  }
};

export const createHoliday = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await Holiday.create(req.body);

    if (!data) {
      throw new Error("Data don't exitst");
    }

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const updateHoliday = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const holiday = await Holiday.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!holiday) {
      throw new Error("Holiday doesn't exist");
    }

    if (
      holiday.authorizationAdmin === "approved" &&
      holiday.authorizationManager === "approved"
    ) {
      const user = await User.findById(holiday.user.id);

      const numberOfDays = holiday.days.length;
      let credit;

      switch (holiday.period) {
        case "future":
          credit = user?.creditFuture?.balance || 0;
          break;
        case "past":
          credit = user?.creditPast?.balance || 0;
          break;
        default:
          credit = user?.credit?.balance || 0;
          break;
      }

      if (
        user &&
        user.credit &&
        user.creditFuture &&
        user.creditPast &&
        credit >= numberOfDays
      ) {
        if (holiday.period === "future")
          user.creditFuture.balance = credit - numberOfDays;
        else if (holiday.period === "past")
          user.creditPast.balance = credit - numberOfDays;
        else user.credit.balance = credit - numberOfDays;
        await user.save({ validateBeforeSave: true });
      }
    }

    res.status(200).json({
      status: "success",
      holiday,
    });
  } catch (err) {
    next(err);
  }
};
