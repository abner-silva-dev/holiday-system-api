import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

const errorController = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const appError = err as AppError;
  appError.statusCode = appError.statusCode || 500;
  appError.status = appError.status || "error";

  // A) API
  res.status(appError.statusCode).json({
    status: appError.status,
    error: appError,
    message: appError.message,
    stack: appError.stack,
  });

  // B) RENDERED WEBSITE
  console.error("ERROR 🔥", err);

  res
    .status(appError.statusCode)
    .render("error", { title: "something went wrong!", msg: err.message });
};

export default errorController;
