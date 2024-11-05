import multer, { FileFilterCallback } from "multer";
import sharp from "sharp";

import { createOne, deleteOne, getOne, updateOne } from "./handleFactory";

import AppError from "../utils/appError";
import { Request, NextFunction, Response } from "express";
import {
  calculatedPeriod,
  computeSeniority,
  getDaysAvailables,
} from "./seniorityController";
import catchAsync from "../utils/catchAsync";

import UserComplementaryData from "../models/userComplementaryDataModel";
import User from "../models/userModel";

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

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/user/${req.file.filename}`);

    next();
  }
);

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
};

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm)
      return next(
        new AppError(
          "Esta ruta no es para actualizar la contraseña por favor usa: /updateMyPassword",
          400
        )
      );

    // 2) filtered out unwanted fields name that are not allewed to be updated
    const filteredBody = { ...req.body };
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document (new: true => return the new object update)
    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updateUser,
      },
    });
  }
);

export const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let query = User.find({});

    if (req.user.role === "manager")
      query = User.find({ department: req.user.department });

    query = query.populate({ path: "holidays" });
    const docs = await query;

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs,
    });
  }
);

// export const getAllUser = getAll(User, { path: "holidays" });
export const getUser = getOne(User, { path: "holidays" });
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
// export const createUser = createOne(User);

export const verifyCredit = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    const currentDate = new Date();
    if (!user?.credit?.exp) return next();

    if (currentDate > user?.credit?.exp) {
      const creditTemp = { ...user.credit };
      const creditFuture = {
        ...user.creditFuture,
        balance: user.creditFuture?.balance || 0, // Ensure balance is a number
      };

      const { years } = computeSeniority(user.dateHiring);

      const daysAvailablesPast = (await getDaysAvailables(years - 1)) || 0;
      const daysAvailables = (await getDaysAvailables(years)) || 0;
      const daysAvailablesFuture = (await getDaysAvailables(years + 1)) || 0;

      const currentPeriod = calculatedPeriod(user.dateHiring, 0);

      user.credit = {
        ...creditFuture,
        exp: currentPeriod.endDate,
      };

      // update past credit.
      user.creditPast = {
        ...creditTemp,
        exp: null,
        balance: user.credit?.balance || 0, // Ensure balance is a number
      };

      user.creditFuture = {
        balance: daysAvailablesFuture, // This is now always a number
      };

      // Past
      user.daysGrantedBySeniorityPast = {
        balance: daysAvailablesPast,
        ...calculatedPeriod(user.dateHiring, -1),
      };

      // Current
      user.daysGrantedBySeniority = {
        balance: daysAvailables,
        ...calculatedPeriod(user.dateHiring, 0),
      };

      // Future
      user.daysGrantedBySeniorityFuture = {
        balance: daysAvailablesFuture,
        ...calculatedPeriod(user.dateHiring, 1),
      };

      await user.save();
    }

    next();
  }
);

export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await User.create(req.body);

    // If no user was created, throw an error.
    if (!data) {
      return next(new AppError("Data doesn't exist", 400)); // Or any error code you prefer
    }

    // Attach the user to the request
    req.user = data;

    // Call the next middleware
    next();
  }
);

export const sendResponse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;

    // If there's a file, update the user
    if (req.file) {
      user = await User.findByIdAndUpdate(
        req.user.id,
        { photo: req.file.filename },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    // Send response
    res.status(200).json({
      status: "success",
      user,
    });
  }
);

/* REQUEST CONTROLLERS */

export const createComplementaryData = createOne(UserComplementaryData);

export const getComplementaryData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Searching document by id
    const complementaryData = await UserComplementaryData.findOne({
      user: req.params.id,
    });

    // Handle errors
    if (!complementaryData)
      throw new AppError(`No se encontro ningun documento`, 404);

    // Send data to client
    res.status(200).json({
      status: "success",
      data: complementaryData,
    });
  }
);

export const updateComplementaryData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const complementaryData = await UserComplementaryData.findOne({
      user: req.params.id,
    });

    // Handle errors
    if (!complementaryData)
      throw new AppError(`No se encontro ningun documento`, 404);

    const data = await UserComplementaryData.findByIdAndUpdate(
      complementaryData._id,
      req.body,
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
  }
);
