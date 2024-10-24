import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import catchAsync from "../utils/catchAsync";

// export const getAll = <T>(Model: Model<T>) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const data = await Model.find({});

//       res.status(200).json({
//         status: "success",
//         results: data.length,
//         data,
//       });
//     } catch (err) {
//       next(err);
//     }
//   };
// };

export const getAll = <T>(Model: Model<T>, popOptions?: { path: string }) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.find({});

    if (popOptions) query = query.populate(popOptions);
    const docs = await query;

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs,
    });
  });
};

export const getOne = <T>(Model: Model<T>, popOptions?: { path: string }) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      throw new Error("Data don't exist");
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};

export const createOne = <T>(Model: Model<T>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filteredBody = { ...req.body };

    if (req.file) filteredBody.photo = req.file.filename;

    const data = await Model.create(filteredBody);

    if (!data) {
      throw new Error("Data don't exitst");
    }

    res.status(200).json({
      status: "success",
      data,
    });
  });
};

export const updateOne = <T>(Model: Model<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filteredBody = { ...req.body };
      if (req.file) filteredBody.photo = req.file.filename;

      const data = await Model.findByIdAndUpdate(req.params.id, filteredBody, {
        new: true,
        runValidators: true,
      });

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
};

export const deleteOne = <T>(Model: Model<T>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await Model.findByIdAndDelete(req.params.id);

    if (!data) {
      throw new Error("Data don't exitst");
    }

    res.status(200).json({
      status: "success",
      data,
    });
  });
};
