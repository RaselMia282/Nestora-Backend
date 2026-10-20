import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { auth } from "../auth/middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();
router.get(
  "/tenant-overview",
  auth(Role.TENANT),
  dashboardController.getTenantDashboardOverview,
);

router.get(
  "/admin-overview",
  auth(Role.ADMIN),
  dashboardController.getAdminDashboardOverview,
);


router.get(
  "/owner-overview",
  auth(Role.ADMIN,Role.OWNER),
  dashboardController.getOwnerDashboardOverview,
);



router.get("/users", auth(Role.ADMIN), dashboardController.getAllUsers);

export const dashboardRoutes = router;
