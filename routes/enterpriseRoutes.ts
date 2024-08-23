import express from "express";
import * as enterpriseController from "./../controllers/enterpriseController";

const router = express.Router();

router.get("/", enterpriseController.getAllEnterprise);

router.get("/:id", enterpriseController.getEnterprise);

export default router;
