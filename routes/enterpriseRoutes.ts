import express from "express";
import * as enterpriseController from "./../controllers/enterpriseController";

const router = express.Router();

router
  .route("/")
  .get(enterpriseController.getAllEnterprise)
  .post(enterpriseController.createEnterprise);

router
  .route("/:id")
  .get(enterpriseController.getEnterprise)
  .delete(enterpriseController.deleteEnterprise)
  .patch(enterpriseController.updateEnterprise);

export default router;
