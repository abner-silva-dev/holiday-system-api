import EnterpriseModel from "../models/enterpriseModel";
import { Request, Response } from "express";

export const getAllEnterprise = async (req: Request, res: Response) => {
  try {
    const enterprise = await EnterpriseModel.find({});

    res.json({
      status: "success",
      data: enterprise,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getEnterprise = (req: Request, res: Response) => {
  res.json({
    status: "success",
    data: [{ id: "2342342", name: "recursos humanos " }],
  });
};

export const createEnterprise = (req: Request, res: Response) => {};
