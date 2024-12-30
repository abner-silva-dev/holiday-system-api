import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Boss, { BossDocument } from "../models/bossModel";
import AppError from "../utils/appError";
import { deleteOne, getAll, getOne } from "./handleFactory";
import User from "../models/userModel";

// export const createBoss = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.params.id;

//     // const boss = await Boss.create(req.body);

//     // if (!boss) throw new AppError("No se pudo crear el jefe", 400);

//     // next();

//     // res.status(200).json({ status: "success", data: boss });
//   }
// );

// export const deleteOne = <T>(Model: Model<T>) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const data = await Model.findByIdAndDelete(req.params.id);

//     if (!data) {
//       throw new Error("Data don't exitst");
//     }

//     res.status(200).json({
//       status: "success",
//       data,
//     });
//   });
// };

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

// export const deleteBoss = deleteOne<BossDocument>(Boss);

export const getAllBoss = getAll<BossDocument>(Boss);

// export const getBoss = getOne<BossDocument>(Boss);
