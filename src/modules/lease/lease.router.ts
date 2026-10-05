import { Router } from "express";
import { leaseController } from "./lease.controller";
import { auth } from "../auth/middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.OWNER), leaseController.createLease);
router.get("/", auth(Role.ADMIN), leaseController.getAllLease);
router.get(
  "/:id",
  auth(Role.OWNER, Role.ADMIN),
  leaseController.getSingleLease,
);
router.patch(
  "/:id",
  auth(Role.OWNER, Role.ADMIN, Role.MANAGER, Role.TENANT),
  leaseController.updateLease,
);
router.patch(
  "/:id/terminate",
  auth(Role.OWNER, Role.OWNER),
  leaseController.terminateLease,
);

router.patch("/id/sign", auth(Role.TENANT), leaseController.signLease);

export const leaseRoutes = router;
