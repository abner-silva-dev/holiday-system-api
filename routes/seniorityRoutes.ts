import express from "express";
import * as seniorityController from "./../controllers/seniorityController";

const router = express.Router();

router
  .route("/")
  .get(seniorityController.getAllSeniority)
  .post(seniorityController.createSeniority);

router
  .route("/:id")
  .get(seniorityController.getSeniority)
  .delete(seniorityController.deleteSeniority)
  .patch(seniorityController.updateSeniority);

export default router;
