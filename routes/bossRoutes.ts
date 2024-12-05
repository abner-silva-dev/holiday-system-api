import express, { Router } from "express";
import * as bossController from "./../controllers/bossController";

const router = express.Router();

router
  .route("/")
  .get(bossController.getAllBoss)
  .post(bossController.createBoss);
router
  .route("/:id")
  .get(bossController.getBoss)
  .delete(bossController.deleteBoss);

export default router;
