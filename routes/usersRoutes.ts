import express from "express";
import * as usersController from "./../controllers/usersController";
import * as authController from "./../controllers/authController";
import * as archiveCotroller from "./../controllers/archiveController";
import * as docDowloadController from "./../controllers/docDowloadController.ts";

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
    authController.signup,
    usersController.sendResponse
  );
/********************************************************/
/* ROUTE GENERATE DOCUMENTS*/
router.route("/:id/dowloadDoc").get(docDowloadController.getDocument);

/********************************************************/
/* ROUTE RESET PASSWORD */

router
  .route("/resetPassword")
  .post(authController.validateUserPassword, authController.resetPassword);

router
  .route("/:id/resetPassword")
  .get(authController.restrictTo("admin"), authController.resetPasswordAuto);

/********************************************************/
/* ROUTE ARCHIVE */
router
  .route("/:id/archive")
  .get(archiveCotroller.getArchive)
  .post(
    archiveCotroller.uploadFields,
    archiveCotroller.saveArchivePDF,
    archiveCotroller.createArchive
  )
  .patch(
    archiveCotroller.uploadFields,
    archiveCotroller.saveArchivePDF,
    archiveCotroller.updateArchive
  );

/********************************************************/
/* ROUTE REQUEST */
// COMPLEMENTARY DATA
router
  .route("/:id/complementaryData")
  .post(usersController.createComplementaryData)
  .get(usersController.getComplementaryData)
  .patch(usersController.updateComplementaryData);

// EMPLOY DATA
router
  .route("/:id/employData")
  .post(usersController.createEmployData)
  .get(usersController.getEmployData)
  .patch(usersController.updateEmployData);

// SCHOLAR DATA
router
  .route("/:id/scholarData")
  .post(usersController.createScholarData)
  .get(usersController.getScholarData)
  .patch(usersController.updateScholarData);

//KNOWLEDGE AND EXPERIENCE
router
  .route("/:id/knowledgeExperience")
  .post(usersController.createKnowledgeExperienceData)
  .get(usersController.getKnowledgeExperienceData)
  .patch(usersController.updateKnowledgeExperienceData);

//FAMILIAR DATA
router
  .route("/:id/familiarData")
  .post(usersController.createFamiliarData)
  .get(usersController.getFamiliarData)
  .patch(usersController.updateFamiliarData);

// CLINIC INFORMATION
router
  .route("/:id/clinicInformation")
  .post(usersController.createClinicInformation)
  .get(usersController.getClinicInformation)
  .patch(usersController.updateClinicInformation);

// PERSONAL REFERENCE
router
  .route("/:id/personalReference")
  .post(usersController.createPersonalReference)
  .get(usersController.getPersonalReference)
  .patch(usersController.updatePersonalReference);

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

router.route("/:id/role").patch(
  authController.restrictTo("admin"),
  authController.validateUserPassword,

  usersController.updateUserRole
);

export default router;
