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
      console.log(docs);
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
      const credit = user?.credit?.balance || 0;
      if (user && user.credit && credit >= numberOfDays) {
        user.credit.balance = credit - numberOfDays;
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
