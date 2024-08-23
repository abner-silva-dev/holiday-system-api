import express from "express";
import * as holidayController from "./../controllers/holidayController";

const router = express.Router();

router.get("/", holidayController.getAllHoliday);

router.get("/:id", holidayController.getHoliday);

export default router;
