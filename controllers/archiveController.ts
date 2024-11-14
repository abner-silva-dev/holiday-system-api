import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";

import catchAsync from "../utils/catchAsync";
import { createOne } from "./handleFactory";
import AppError from "../utils/appError";
import Archive from "../models/archiveModel";
import fs from "fs";
import path from "path";

const multerStorage = multer.memoryStorage();

// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/archive/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para evitar colisiones
//   },
// });

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new AppError("Solo se permiten archivos PDF", 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limitar a 5 MB por archivo
});

export const uploadFields = upload.fields([
  { name: "curriculumVitae", maxCount: 1 },
  { name: "actaNacimiento", maxCount: 1 },
  { name: "curp", maxCount: 1 },
  { name: "comprobanteDomicilio", maxCount: 1 },
  { name: "ine", maxCount: 1 },
  { name: "imssDoc", maxCount: 1 },
  { name: "rfc", maxCount: 1 },
  { name: "creditoInfonavit", maxCount: 1 },
  { name: "afore", maxCount: 1 },
  { name: "cartaRecomentacion", maxCount: 1 },
  { name: "estadoCuenta", maxCount: 1 },
  { name: "comprobanteEstudiosCelula", maxCount: 1 },
  { name: "licenciaConducir", maxCount: 1 },
]);

export const saveArchivePDF = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files) return next(new AppError("No files uploaded!", 400));

    const fileFields = [
      "curriculumVitae",
      "actaNacimiento",
      "curp",
      "comprobanteDomicilio",
      "ine",
      "imssDoc",
      "rfc",
      "creditoInfonavit",
      "afore",
      "cartaRecomentacion",
      "estadoCuenta",
      "comprobanteEstudiosCelula",
      "licenciaConducir",
    ];

    const savedFiles: { [key: string]: string } = {};

    await Promise.all(
      fileFields.map(async (field) => {
        const fileArray = (
          req?.files as { [key: string]: Express.Multer.File[] }
        )?.[field];

        if (fileArray && fileArray.length > 0) {
          const file = fileArray[0];
          const filename = `${field}-${req.params.id}.pdf`;
          const filePath = `public/archive/${filename}`;
          await fs.promises.writeFile(filePath, file.buffer);
          savedFiles[field] = filename;
        }
      })
    );

    req.body.files = savedFiles;
    next();
  }
);

export const createArchive = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const archiveData = {
      ...req.body.files,
      user: req.params.id,
    };

    const archive = await Archive.create(archiveData);

    res.status(200).json({
      status: "success",
      data: archive,
    });
  }
);

export const getArchive = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Searching document by user id
    const archive = await Archive.findOne({
      user: req.params.id,
    });

    // Handle errors
    if (!archive)
      throw new AppError(
        `No se encontró ningún archivo con id: ${req.params.id}`,
        404
      );

    // Send data to client
    res.status(200).json({
      status: "success",
      data: archive,
    });
  }
);

export const updateArchive = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const archive = await Archive.findOne({
      user: req.params.id,
    });

    // Handle errors
    if (!archive)
      throw new AppError(
        `No se encontró ningún archivo con id: ${req.params.id}`,
        404
      );

    const newArchiveData = {
      ...req.body.files,
    };

    const data = await Archive.findByIdAndUpdate(archive._id, newArchiveData, {
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
  }
);
