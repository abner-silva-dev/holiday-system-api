import express from "express";
import * as usersController from "./../controllers/usersController";
import * as authController from "./../controllers/authController";

const router = express.Router();

router.get("/logout", authController.logout);
router.post("/login", authController.login);

router.use(authController.protect);

router
  .route("/")
  .get(usersController.getAllUser)
  .post(usersController.createUser);

router
  .route("/:id")
  .get(usersController.getUser)
  .delete(usersController.deleteUser)
  .patch(usersController.updateUser);

export default router;
