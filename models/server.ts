import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import departmentRoutes from "../routes/departmentRoutes";
import holidayRoutes from "../routes/holidayRoutes";
import enterpriseRoutes from "../routes/enterpriseRoutes";
import usersRoutes from "../routes/usersRoutes";
import seniorityRoutes from "../routes/seniorityRoutes";
import bossRoutes from "../routes/bossRoutes";

import AppError from "../utils/appError";
import { globalErrorHandler } from "./../controllers/errorController";
import Email from "../utils/email";
import ExpressMongoSanitize from "express-mongo-sanitize";

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    // MIDDLEWARES
    this.middlewares();

    // INIT ROUTES
    this.routes();
  }

  middlewares() {
    // ABLE CORS
    const ip = this.app.use(
      cors({
        origin: [
          "http://192.168.68.76:5173",
          "http://localhost:5173",
          "https://piapdai.netlify.app",
        ],
        methods: ["GET", "POST", "PATCH", "DELETE"], // Métodos permitidos
        credentials: true, // Si necesitas enviar cookies o autenticación
      })
    );

    // SERVING STATIC FILES
    this.app.use(express.static("public"));

    // ABLE BODY REQUEST
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // COOKIES
    this.app.use(cookieParser());
    // this.app.use(compression());

    // Data sanitization against NoSQL query injection
    this.app.use(ExpressMongoSanitize());
  }

  routes() {
    this.app.use("/api/v1/department", departmentRoutes);
    this.app.use("/api/v1/holiday", holidayRoutes);
    this.app.use("/api/v1/enterprise", enterpriseRoutes);
    this.app.use("/api/v1/seniority", seniorityRoutes);
    this.app.use("/api/v1/users", usersRoutes);
    this.app.use("/api/v1/boss", bossRoutes);

    this.app.all("*", (req, _, next) => {
      next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
    });

    this.app.use(globalErrorHandler);
  }

  listen() {
    return this.app.listen(this.port, () => {
      console.log(`Server listem in port ${this.port}`);
    });
  }
}

export default Server;
