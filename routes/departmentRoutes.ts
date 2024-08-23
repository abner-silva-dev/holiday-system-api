import express from "express";
import * as departmentController from "./../controllers/departmentController";

const router = express.Router();

router
  .route("/")
  .get(departmentController.getAllDepartment)
  .post(departmentController.createDepartment);

router
  .route("/:id")
  .get(departmentController.getDepartment)
  .delete(departmentController.deleteDepartment)
  .patch(departmentController.updateDepartment);

export default router;
