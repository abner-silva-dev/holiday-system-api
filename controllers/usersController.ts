import User from "../models/userModel";
import multer, { FileFilterCallback } from "multer";
import sharp from "sharp";

import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";

import AppError from "../utils/appError";
import { Request, NextFunction, Response } from "express";

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: Express.Multer.File, cb) => {
  if (file.mimetype.startsWith("image")) {
    return cb(null, true);
  }

  cb(new AppError("Not an image! Please upload only images", 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/user/${req.file.filename}`);

    next();
  } catch (error) {
    next(error);
  }
};

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const getAllUser = getAll(User, { path: "holidays" });
export const getUser = getOne(User, { path: "holidays" });
export const createUser = createOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);

// export const createUser = <T>(Model: Model<T>) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const data = await Model.create(req.body);

//       if (!data) {
//         throw new Error("Data don't exitst");
//       }

//       res.status(200).json({
//         status: "success",
//         data,
//       });
//     } catch (err) {
//       next(err);
//     }
//   };
// };
