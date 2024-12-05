import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Boss, { BossDocument } from "../models/bossModel";
import AppError from "../utils/appError";
import { deleteOne, getAll, getOne } from "./handleFactory";

export const createBoss = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const boss = await Boss.create(req.body);

    if (!boss) throw new AppError("No se pudo crear el jefe", 400);

    res.status(200).json({ status: "success", data: boss });
    //   res
    //     .status(200)
    //     .json({ data: req.body, res: "Te estoy respondiendo desde el server" });
    // }
  }
);

export const deleteBoss = deleteOne<BossDocument>(Boss);

export const getAllBoss = getAll<BossDocument>(Boss);

export const getBoss = getOne<BossDocument>(Boss);
