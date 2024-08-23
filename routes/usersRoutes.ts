import express from "express";
import * as usersController from "./../controllers/usersController";

const router = express.Router();

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
