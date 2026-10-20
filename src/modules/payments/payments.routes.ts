import { Router } from "express";
import { paymentController } from "./payments.controller";
import { Role } from "../../generated/prisma/enums";
import { auth } from "../auth/middleware";

const router = Router();
router.post("/", auth(Role.TENANT), paymentController.createPayment);
router.post("/webhook", paymentController.handleWebhook);
router.get("/", auth(Role.TENANT), paymentController.getMyPayment);

export const paymentRoutes = router;
