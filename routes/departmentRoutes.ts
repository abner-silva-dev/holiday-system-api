import express from "express";
import * as departmentController from "./../controllers/departmentController";
import * as authController from "./../controllers/authController";

const router = express.Router();

router.use(authController.protect);

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
