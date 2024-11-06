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
import UserScholarData from "../models/userScholarDataModel";
import UserClinicInformation from "../models/userClinicInformationDataModel";
import UserKnowledgeExperienceData from "../models/userKnowledgeExperienceDataModel";
import UserFamiliarData from "../models/userFamiliarDataModel";
import UserPersonalReference from "../models/userPersonalReferenceDataModel";

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

/* ********************************************************************************* */
/* REQUEST CONTROLLERS */
// COMPLEMENTARY DATA
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

// SCHOLAR DATA
export const createScholarData = createOne(UserScholarData);
export const getScholarData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Searching document by id
    const scholarData = await UserScholarData.findOne({ user: req.params.id });

    // Handle errors
    if (!scholarData)
      throw new AppError(
        `No se encontro ningun documento con id: ${req.params.idRequest}`,
        404
      );

    // Send data to client
    res.status(200).json({
      status: "success",
      data: scholarData,
    });
  }
);
export const updateScholarData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const scholarData = await UserScholarData.findOne({
      user: req.params.id,
    });

    // Handle errors
    if (!scholarData)
      throw new AppError(`No se encontro ningun documento`, 404);

    const data = await UserScholarData.findByIdAndUpdate(
      scholarData._id,
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

// KNOWLEDGE AND EXPERIENCE DATA
export const createKnowledgeExperienceData = createOne(
  UserKnowledgeExperienceData
);
export const getKnowledgeExperienceData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Searching document by id
    const knowledgeExperience = await UserKnowledgeExperienceData.findOne({
      user: req.params.id,
    });

    // Handle errors
    if (!knowledgeExperience)
      throw new AppError(
        `No se encontro ningun documento con id: ${req.params.idRequest}`,
        404
      );

    // Send data to client
    res.status(200).json({
      status: "success",
      data: knowledgeExperience,
    });
  }
);
export const updateKnowledgeExperienceData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const knowledgeExperience = await UserKnowledgeExperienceData.findOne({
      user: req.params.id,
    });

    // Handle errors
    if (!knowledgeExperience)
      throw new AppError(`No se encontro ningun documento`, 404);

    const data = await UserKnowledgeExperienceData.findByIdAndUpdate(
      knowledgeExperience._id,
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

// FAMILIAR DATA
export const createFamiliarData = createOne(UserFamiliarData);
export const getFamiliarData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Searching document by id
    const familiarData = await UserFamiliarData.findOne({
      user: req.params.id,
    });

    // Handle errors
    if (!familiarData)
      throw new AppError(
        `No se encontro ningun documento con id: ${req.params.idRequest}`,
        404
      );

    // Send data to client
    res.status(200).json({
      status: "success",
      data: familiarData,
    });
  }
);

export const updateFamiliarData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const familiarData = await UserFamiliarData.findOne({
      user: req.params.id,
    });

    // Handle errors
    if (!familiarData)
      throw new AppError(`No se encontro ningun documento`, 404);

    const data = await UserFamiliarData.findByIdAndUpdate(
      familiarData._id,
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

//CLINIC INFORMATION
export const createClinicInformation = createOne(UserClinicInformation);
export const getClinicInformation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Searching document by id
    const clinicInformation = await UserClinicInformation.findOne({
      user: req.params.id,
    });

    // Handle errors
    if (!clinicInformation)
      throw new AppError(
        `No se encontró ningún documento con id: ${req.params.clinicInfoId}`,
        404
      );

    // Send data to client
    res.status(200).json({
      status: "success",
      data: clinicInformation,
    });
  }
);

export const updateClinicInformation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const clinicInformation = await UserClinicInformation.findOne({
      user: req.params.id,
    });

    // Handle errors
    if (!clinicInformation)
      throw new AppError(`No se encontro ningun documento`, 404);

    const data = await UserClinicInformation.findByIdAndUpdate(
      clinicInformation._id,
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

//PERSONAL REFERENCE
export const createPersonalReference = createOne(UserPersonalReference);
export const getPersonalReference = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Searching document by user id
    const personalReference = await UserPersonalReference.findOne({
      user: req.params.id,
    });

    // Handle errors
    if (!personalReference)
      throw new AppError(
        `No se encontró ningún documento con id: ${req.params.id}`,
        404
      );

    // Send data to client
    res.status(200).json({
      status: "success",
      data: personalReference,
    });
  }
);

export const updatePersonalReference = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const personalReference = await UserPersonalReference.findOne({
      user: req.params.id,
    });

    // Handle errors
    if (!personalReference)
      throw new AppError(`No se encontro ningun documento`, 404);

    const data = await UserPersonalReference.findByIdAndUpdate(
      personalReference._id,
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
