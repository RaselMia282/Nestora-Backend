import { Router } from "express";
import { applicationController } from "./application.controller";
import { auth } from "../auth/middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post("/", auth(), applicationController.createApplication);

router.get(
  "/",
  auth(Role.OWNER, Role.TENANT, Role.ADMIN),
  applicationController.getApplication,
);

router.get("/:id", applicationController.getSingleApplication);

router.patch(
  "/:id",
  auth(Role.OWNER, Role.ADMIN),
  applicationController.updateApplication,
);

router.delete(
  "/:id",
  auth(Role.ADMIN, Role.OWNER),
  applicationController.deleteApplication,
);

router.patch(
  "/:id/status",
  auth(Role.OWNER, Role.ADMIN),
  applicationController.updateApplicationStatusByOwner,
);

export const applicationRoutes = router;
