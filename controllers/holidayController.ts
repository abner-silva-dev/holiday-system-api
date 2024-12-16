import { NextFunction, Request, Response } from "express";
import Holiday, { HolidayDocument } from "../models/holidayModel";

import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";
import User, { UserDocument } from "../models/userModel";

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

const computeCreditUser = async (
  holiday: HolidayDocument,
  user: UserDocument
) => {
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

  if (!user && credit <= numberOfDays) return;

  if (holiday.period === "future" && user.creditFuture) {
    user.creditFuture.balance = credit - numberOfDays;
  } else if (holiday.period === "past" && user.creditPast) {
    user.creditPast.balance = credit - numberOfDays;
  } else if (user.credit) {
    user.credit.balance = credit - numberOfDays;
  }

  await user.save({ validateBeforeSave: true });
};

export const createHoliday = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const holiday = await Holiday.create(req.body);

    if (!holiday) {
      throw new Error("holiday don't exitst");
    }
    // 1) Cumpute credit.
    const user = await User.findById(holiday.user);
    if (user) await computeCreditUser(holiday, user);

    res.status(200).json({
      status: "success",
      holiday,
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
    const holidayBefore = await Holiday.findById(req.params.id);

    if (
      holidayBefore?.authorizationAdmin === req.body.authorizationAdmin ||
      holidayBefore?.authorizationManager === req.body.authorizationManager
    )
      return;

    const holiday = await Holiday.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!holiday) throw new Error("Holiday doesn't exist");

    const {
      authorizationAdmin,
      authorizationManager,
      period,
      days,
      user: userRef,
    } = holiday;
    const isApproved =
      authorizationAdmin === "approved" && authorizationManager === "approved";
    const isRejected =
      authorizationAdmin === "rejected" || authorizationManager === "rejected";
    const someApproved =
      authorizationAdmin === "approved" || authorizationManager === "approved";

    if (isApproved || isRejected || someApproved) {
      const user = await User.findById(userRef.id);
      if (!user) throw new Error("User not found");

      const numberOfDays = days.length;

      let credit;

      switch (period) {
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

      if (credit && (isApproved || someApproved) && credit >= numberOfDays) {
        switch (period) {
          case "future":
            if (user.creditFuture)
              user.creditFuture.balance = (credit ?? 0) - numberOfDays;
            break;
          case "past":
            if (user.creditPast)
              user.creditPast.balance = (credit ?? 0) - numberOfDays;
            break;
          default:
            if (user.credit) user.credit.balance = (credit ?? 0) - numberOfDays;
            break;
        }
        await user.save({ validateBeforeSave: true });
      } else if (isRejected) {
        switch (period) {
          case "future":
            if (user.creditFuture)
              user.creditFuture.balance = (credit ?? 0) + numberOfDays;
            break;
          case "past":
            if (user.creditPast)
              user.creditPast.balance = (credit ?? 0) + numberOfDays;
            break;
          default:
            if (user.credit) user.credit.balance = (credit ?? 0) + numberOfDays;
            break;
        }
        await user.save({ validateBeforeSave: true });
      }
    }

    res.status(200).json({ status: "success", holiday });
  } catch (err) {
    next(err);
  }
};
