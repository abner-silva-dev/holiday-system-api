import express from "express";
import * as departmentController from "./../controllers/departmentController";

const router = express.Router();

router.get("/", departmentController.getAllDepartment);

router.get("/:id", departmentController.getDepartment);

export default router;
