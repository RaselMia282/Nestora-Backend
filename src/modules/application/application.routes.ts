import { Router } from "express";
import { applicationController } from "./application.controller";
import { auth } from "../auth/middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();
router.post("/",auth(), applicationController.createApplication);
router.get("/",auth(Role.OWNER,Role.TENANT), applicationController.getApplication);
router.get("/", applicationController.getSingleApplication);
router.patch("/:id", applicationController.updateApplication);
router.delete("/:id", applicationController.deleteApplication);

export const applicationRoutes = router;



