import UsersModel from "../models/usersModel";
import { Request, Response } from "express";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UsersModel.find({});

    res.json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getUsers = (req: Request, res: Response) => {
  res.json({
    status: "success",
    data: [{ id: "2342342", name: "recursos humanos " }],
  });
};

export const createUsers = (req: Request, res: Response) => {};
