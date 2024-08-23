import { Request, Response } from "express";
import HolidayModel from "../models/holidayModel";

export const getAllHoliday = async (req: Request, res: Response) => {
  try {
    const holidays = await HolidayModel.find({});

    res.json({
      status: "success",
      data: holidays,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getHoliday = (req: Request, res: Response) => {
  res.json({
    status: "success",
    data: [{ id: "2342342", name: "ss " }],
  });
};

export const createHoliday = (req: Request, res: Response) => {};
