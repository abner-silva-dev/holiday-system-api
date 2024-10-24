import multer, { FileFilterCallback } from "multer";
import Enterprise from "../models/enterpriseModel";
import sharp from "sharp";

import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    return cb(null, true);
  }

  cb(new AppError("Not an image! Please upload only images", 400));
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadEnterpriseLogo = upload.single("logo");

export const resizeEnterpriseLogo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    req.file.filename = `enterprise-${req.params.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/enterprise/${req.file.filename}`);

    next();
  }
);

export const createEnterprise = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await Enterprise.create(req.body);

    // If no user was created, throw an error.
    if (!data) {
      return next(new AppError("Data doesn't exist", 400)); // Or any error code you prefer
    }

    // Attach the user to the request
    req.enterprise = data;

    // Call the next middleware
    next();
  }
);

export const sendResponse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let enterprise = req.enterprise;

    // If there's a file, update
    if (req.file) {
      enterprise = await Enterprise.findByIdAndUpdate(
        req.enterprise._id,
        { logo: req.file.filename },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    // Send response
    res.status(200).json({
      status: "success",
      enterprise,
    });
  }
);

export const updateEnterprise = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filteredBody = { ...req.body };
    if (req.file) filteredBody.logo = req.file.filename;

    const data = await Enterprise.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!data) {
      throw new Error("Data don't exitst");
    }

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// export const createEnterprise = createOne(Enterprise);
// export const updateEnterprise = updateOne(Enterprise);
export const getAllEnterprise = getAll(Enterprise);
export const getEnterprise = getOne(Enterprise);
export const deleteEnterprise = deleteOne(Enterprise);
