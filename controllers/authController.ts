import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import User, { UserDocument } from "../models/userModel";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import Email from "../utils/email";
import { randomBytes } from "crypto";

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (
  user: UserDocument,
  statusCode: number,
  req: Request,
  res: Response,
  sendUser = false
) => {
  const token = signToken(user.id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwaded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  const resObjectJSON = sendUser
    ? {
        status: "success",
        token,
        data: {
          user,
        },
      }
    : {
        status: "success",
        token,
      };

  res.status(statusCode).json(resObjectJSON);
};

function generatePassword(length = 16) {
  return randomBytes(length).toString("hex");
}

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const resetPasswordAuto = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) return new AppError("No se encontro usuario", 404);

    const passwordGenerated = generatePassword(2);

    user.password = passwordGenerated;

    await user.save({ validateBeforeSave: true });

    new Email({
      email: user?.email || "",
      name: user?.name || "",
    }).sendPassword({
      password: passwordGenerated,
    });

    res.status(201).json({
      status: "sucess",
    });
  }
);

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;

    if (!user) return next();

    const password = generatePassword(2);

    user = await User.findByIdAndUpdate(
      req.user.id,
      { password },
      {
        new: true,
        runValidators: true,
      }
    );

    new Email(user).sendPassword({ password });

    next();
  }
);

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { employNumber, password } = req.body;

    // 1) EmployNumber and password exist
    if (!employNumber || !password)
      return next(
        new AppError(
          "Por favor proporcione un numero de empleado y una contraseña",
          400
        )
      );

    // 2) Check if the user exits && password is correct
    const user = await User.findOne({ employNumber }).select("+password");

    if (!user || !user.correctPassword(password, user?.password || ""))
      return next(
        new AppError("Numero de empleado o contraseña incorrectos", 401)
      );

    // 3) If everything ok, send token to client
    createSendToken(user, 200, req, res, true);
  } catch (error) {
    next(error);
  }
};

export const validateUserPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;

    // Check if the password is provided
    if (!password) {
      return next(
        new AppError("Por favor, proporcione una contraseña válida.", 400)
      );
    }

    // Find the user by ID and include the password field
    const user = await User.findById(req.user.id).select("+password");

    // Verify if the user exists and if the password is correct
    const isPasswordCorrect =
      user && user.correctPassword(password, user.password || "");

    if (!isPasswordCorrect) {
      return next(
        new AppError("Contraseña incorrecta o usuario no encontrado.", 401)
      );
    }

    // If all checks pass, proceed to the next middleware
    next();
  }
);

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1) Getting token and check if it's there
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError(
          "No se encuentra logeado, por favor logeate para tener acceso.",
          401
        )
      );
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);

    // if (!currentUser) {
    //   return next(
    //     new AppError("El usuario que pertenece a este token ya no existe", 401)
    //   );
    // }

    // 4) Check if user changed password after the token was issued
    // if (currentUser.changedPasswordAfter(decoded.iat))
    //   return next(
    //     new AppError(
    //       "User recently changed password! Please log in again.",
    //       401
    //     )
    //   );

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

export const restrictTo = (...roles: ("user" | "admin" | "manager")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("No tienes permiso para realizar esta acción.", 401)
      );

    next();
  };
};
