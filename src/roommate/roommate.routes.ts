import { Router } from "express";

import { RoommateController } from "./roommate.controller";
import { auth } from "../modules/auth/middleware";
import { Role } from "../generated/prisma/enums";
import { upload } from "../lib/multer";

const router = Router();
router.post(
  "/profile",
  auth(Role.TENANT),
  RoommateController.createRoommateProfile,
);

router.get(
  "/profile/me",
  auth(Role.TENANT),
  RoommateController.getMyRoommateProfile,
);

router.patch(
  "/profile/me",
  auth(Role.TENANT),
  RoommateController.updateRoommateProfile,
);

router.patch(
  "/profile/image",
  auth(Role.TENANT),
  upload.single("image"),
  RoommateController.updateRoommateProfileImg,
);

router.get(
  "/",
  auth(Role.TENANT, Role.OWNER),
  RoommateController.getAllRoommates,
);

router.get(
  "/:id",
  auth(Role.TENANT, Role.OWNER),
  RoommateController.getSingleRoommate,
);
export const roommateRoutes = router;
