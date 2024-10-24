import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import { CLIENT_RENEG_LIMIT } from "tls";

// Definir los tipos de los errores específicos de MongoDB y JWT
interface CastError extends Error {
  path: string;
  value: string;
}

interface MongoError extends Error {
  code: number;
  errmsg: string;
  errors: { [key: string]: { message: string } };
}

// Manejo del error de Cast (error de conversión de tipo en MongoDB)
const handlerCastErrorDB = (err: CastError): AppError => {
  const message = `no valido ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Manejo del error por token JWT inválido
const handleJWTError = (): AppError =>
  new AppError("Token no válido. ¡Inicia sesión nuevamente!", 401);

// Manejo del error por token JWT expirado
const handleJWTExpiredError = (): AppError =>
  new AppError("¡Tu token ha expirado! Vuelve a iniciar sesión", 401);

// Manejo del error por campos duplicados en MongoDB
const handlerDuplicateFieldsDB = (err: MongoError): AppError => {
  const value =
    err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)?.[0] || "desconocido";
  const message = `Campos duplicados valor: ${value}. ¡Por favor use otro!`;
  return new AppError(message, 400);
};

// Manejo del error por validación de datos en MongoDB
const handleValidationErrorDB = (err: MongoError): AppError => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Datos de entrada no válidos. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Enviar el error en modo desarrollo
const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  console.error("ERROR 🔥", err);

  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  res.status(err.statusCode).render("error", {
    title: "Algo salio mal!",
    msg: err.message,
  });
};

// Enviar el error en modo producción
const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    console.error("ERROR 🔥", err);

    return res.status(500).json({
      status: "error",
      message: "Algo salio mal",
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Algo salio mal!",
      msg: err.message,
    });
  }

  res.status(500).render("error", {
    title: "Algo salio mal!",
    msg: "intente mas tarde",
  });
};

// Controlador de errores principal
export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const appError = err as AppError;
  appError.statusCode = appError.statusCode || 500;
  appError.status = appError.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(appError, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(appError);
    console.log(error);

    if (error.name === "CastError")
      error = handlerCastErrorDB(error as CastError);
    if ((error as MongoError).code === 11000)
      error = handlerDuplicateFieldsDB(error as MongoError);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error as MongoError);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
