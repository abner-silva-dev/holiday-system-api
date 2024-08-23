import DepartmentModel from "../models/departmentModel";
import { Request, Response } from "express";

export const getAllDepartment = async (req: Request, res: Response) => {
  try {
    const departments = await DepartmentModel.find({});

    res.json({
      status: "success",
      data: departments,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getDepartment = (req: Request, res: Response) => {
  res.json({
    status: "success",
    data: [{ id: "2342342", name: "recursos humanos " }],
  });
};

export const createDepartment = (req: Request, res: Response) => {};
