import { Router } from "express";
import { applicationController } from "./application.controller";

const router = Router();
router.post("/", applicationController.createApplication);
router.get("/", applicationController.getApplication);
router.get("/", applicationController.getSingleApplication);
router.patch("/", applicationController.updateApplication);
router.delete("/", applicationController.deleteApplication);

export const applicationRoutes = router;



