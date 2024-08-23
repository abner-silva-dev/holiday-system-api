import express from "express";
import * as seniorityController from "./../controllers/seniorityController";

const router = express.Router();

router.get("/", seniorityController.getAllSeniority);

router.get("/:id", seniorityController.getSeniority);

export default router;
