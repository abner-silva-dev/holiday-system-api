import express, { Application } from "express";
import cors from "cors";

import departmentRoutes from "../routes/departmentRoutes";
import holidayRoutes from "../routes/holidayRoutes";
import enterpriseRoutes from "../routes/enterpriseRoutes";
import usersRoutes from "../routes/usersRoutes";
import seniorityRoutes from "../routes/seniorityRoutes";

class Server {
  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3000";

    // MIDDLEWARES
    this.middlewares();

    // INIT ROUTES
    this.routes();
  }

  middlewares() {
    // ABLE CORS
    this.app.use(cors());

    // ABLE BODY REQUEST
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  routes() {
    // this.app.use("/", (req, res) => {
    //   res.end("API asdfS");
    // });
    this.app.use("/department", departmentRoutes);
    this.app.use("/holiday", holidayRoutes);
    this.app.use("/enterprise", enterpriseRoutes);
    this.app.use("/seniority", seniorityRoutes);
    this.app.use("/users", usersRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listem in port ${this.port}`);
    });
  }
}

export default Server;
