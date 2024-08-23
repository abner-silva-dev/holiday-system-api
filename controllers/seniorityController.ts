import SeniorityModel from "../models/seniorityModel";
import { Request, Response } from "express";

export const getAllSeniority = async (req: Request, res: Response) => {
  try {
    const seniority = await SeniorityModel.find({});

    res.json({
      status: "success",
      data: seniority,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getSeniority = (req: Request, res: Response) => {
  res.json({
    status: "success",
    data: [{ id: "2342342", name: "recursos humanos " }],
  });
};

export const createSeniority = (req: Request, res: Response) => {};
