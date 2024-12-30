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
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

export const getHoliday = getOne(Holiday);
export const deleteHoliday = deleteOne(Holiday);

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

const restBalanceCredit = async (
  curCredit: number,
  period = "current",
  user: UserDocument,
  numberOfDays: number
) => {
  switch (period) {
    case "future":
      if (user.creditFuture)
        user.creditFuture.balance = (curCredit ?? 0) - numberOfDays;
      break;
    case "past":
      if (user.creditPast)
        user.creditPast.balance = (curCredit ?? 0) - numberOfDays;
      break;
    default:
      if (user.credit) user.credit.balance = (curCredit ?? 0) - numberOfDays;
      break;
  }

  await user.save({ validateBeforeSave: true });
};

const getCredit = (period: string, user: UserDocument) => {
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

  return credit;
};

const getStaticCredit = (period: string, user: UserDocument) => {
  let credit;

  switch (period) {
    case "future":
      credit = user?.daysGrantedBySeniorityFuture?.balance || 0;
      break;
    case "past":
      credit = user?.daysGrantedBySeniorityPast?.balance || 0;
      break;
    default:
      credit = user?.daysGrantedBySeniority?.balance || 0;
      break;
  }

  return credit;
};

const addBalanceCredit = async (
  curCredit: number,
  period = "current",
  user: UserDocument,
  numberOfDays: number
) => {
  switch (period) {
    case "future":
      if (user.creditFuture)
        user.creditFuture.balance = (curCredit ?? 0) + numberOfDays;
      break;
    case "past":
      if (user.creditPast)
        user.creditPast.balance = (curCredit ?? 0) + numberOfDays;
      break;
    default:
      if (user.credit) user.credit.balance = (curCredit ?? 0) + numberOfDays;
      break;
  }
  await user.save({ validateBeforeSave: true });
};

export const updateHoliday = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const holidayBefore = await Holiday.findById(req.params.id);

      if (!holidayBefore)
        return next(new AppError("Holiday doesn't exist", 404));

      const userBefore = await User.findById(holidayBefore.user);
      if (!userBefore) return next(new AppError("User not found", 404));
      const creditBeforeTemp = getCredit(holidayBefore.period, userBefore);
      const creditBeforeStatic = getStaticCredit(
        holidayBefore.period,
        userBefore
      );

      if (
        (req.body.authorizationAdmin === "rejected" ||
          req.body.authorizationAdmin === "rejected") &&
        req.body.days.length > creditBeforeStatic
      ) {
        return next(
          new AppError("No se pueden agregar mas dias credito invalido", 400)
        );
      }

      const holiday = await Holiday.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!holiday) return next(new AppError("Holiday doesn't exist", 404));

      const {
        authorizationAdmin,
        authorizationManager,
        period,
        days,
        user: userRef,
      } = holiday;

      const user = await User.findById(userRef.id);

      if (!user) return next(new AppError("User not found", 404));

      const creditBefore = getCredit(holidayBefore.period, user);
      const creditAfter = getCredit(period, user);

      const daysBefore = holidayBefore.days.length;
      const daysAfter = days.length;

      // Handle authorization changes
      const isApproved =
        authorizationAdmin === "approved" &&
        authorizationManager === "approved";
      const someRejected =
        authorizationAdmin === "rejected" ||
        authorizationManager === "rejected";
      const someApproved =
        authorizationAdmin === "approved" ||
        authorizationManager === "approved";
      const someRejectedBefore =
        holidayBefore.authorizationAdmin === "rejected" ||
        holidayBefore.authorizationManager === "rejected";

      // Adjust credit based on the difference in days
      if (daysBefore !== daysAfter) {
        await restBalanceCredit(
          creditBefore + daysBefore,
          holidayBefore.period,
          user,
          daysAfter
        );
      }

      if (someRejectedBefore) {
        if (someRejected !== someRejectedBefore)
          await restBalanceCredit(creditAfter, period, user, daysAfter);
      } else if (someRejected)
        await addBalanceCredit(creditAfter, period, user, daysAfter);

      res.status(200).json({ status: "success", holiday });
    } catch (err) {
      next(err);
    }
  }
);
