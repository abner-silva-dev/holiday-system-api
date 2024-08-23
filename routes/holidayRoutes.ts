import express from "express";
import * as holidayController from "./../controllers/holidayController";

const router = express.Router();

router
  .route("/")
  .get(holidayController.getAllHoliday)
  .post(holidayController.createHoliday);

router
  .route("/:id")
  .get(holidayController.getHoliday)
  .delete(holidayController.deleteHoliday)
  .patch(holidayController.updateHoliday);

export default router;
