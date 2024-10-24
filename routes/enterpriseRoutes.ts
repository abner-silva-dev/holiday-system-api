import express from "express";
import * as enterpriseController from "./../controllers/enterpriseController";
import * as authController from "./../controllers/authController";

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(enterpriseController.getAllEnterprise)
  .post(
    enterpriseController.uploadEnterpriseLogo,
    enterpriseController.createEnterprise,
    enterpriseController.resizeEnterpriseLogo,
    enterpriseController.sendResponse
  );

router
  .route("/:id")
  .get(enterpriseController.getEnterprise)
  .delete(enterpriseController.deleteEnterprise)
  .patch(
    enterpriseController.uploadEnterpriseLogo,
    enterpriseController.resizeEnterpriseLogo,
    enterpriseController.updateEnterprise
  );

export default router;
