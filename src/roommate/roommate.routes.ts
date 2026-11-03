import { Router } from "express";

import { RoommateController } from "./roommate.controller";
import { auth } from "../modules/auth/middleware";
import { Role } from "../generated/prisma/enums";

const router = Router();
router.post(
  "/profile",
  auth(Role.TENANT),
  RoommateController.createRoommateProfile,
);
export const roommateRoutes = router;
