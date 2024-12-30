import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Boss, { BossDocument } from "../models/bossModel";
import AppError from "../utils/appError";
import { getAll } from "./handleFactory";

export const deleteBoss = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const boss = await Boss.findOne({ user: req.params.id });

    if (!boss) return;
    const data = await Boss.findByIdAndDelete(boss._id);

    if (!data) {
      throw new Error("Data don't exitst");
    }

    res.status(200).json({
      status: "success",
      data,
    });
  }
);

export const getBoss = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const boss = await Boss.findOne({
      $or: [
        { _id: req.params.id },
        { user: req.params.id },
        { department: req.params.id },
      ],
    });

    if (!boss) {
      return next(new AppError("Jefe no encontrado", 404));
    }

    res.status(200).json({
      status: "success",
      data: boss,
    });
  }
);

export const getAllBoss = getAll<BossDocument>(Boss);
