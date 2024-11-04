import express from "express";
import * as usersController from "./../controllers/usersController";
import * as authController from "./../controllers/authController";

const router = express.Router();

router.get("/logout", authController.logout);
router.post("/login", authController.login);

router.use(authController.protect);

router.get("/me", usersController.getMe, usersController.getUser);

router.patch(
  "/updateMe",
  usersController.uploadUserPhoto,
  usersController.resizeUserPhoto,
  usersController.updateMe
);

router
  .route("/")
  .get(
    authController.restrictTo("admin", "manager"),
    usersController.getAllUser
  )
  .post(
    usersController.uploadUserPhoto,
    usersController.createUser,
    usersController.resizeUserPhoto,
    usersController.sendResponse
  );

/* ROUTE REQUEST */

router
  .route("/:id/complementaryData")
  .post(usersController.createComplementaryData)
  .get(usersController.getComplementaryData)
  .patch(usersController.updateComplementaryData);

/******************************************************* */

router
  .route("/:id")
  .get(usersController.verifyCredit, usersController.getUser)
  .delete(usersController.deleteUser)
  .patch(
    usersController.uploadUserPhoto,
    usersController.resizeUserPhoto,
    usersController.updateUser
  );

export default router;
