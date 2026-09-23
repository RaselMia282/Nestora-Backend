import { Router } from "express";
import { authController } from "./auth.controller";
import { Role } from "../generated/prisma/enums";
import { auth } from "./middleware";
import { upload } from "../lib/multer";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get(
  "/me",
  auth(Role.ADMIN, Role.MANAGER, Role.OWNER, Role.TENANT),
  authController.getMyProfile,
);
router.post("/google-login", authController.googleLogin);
router.patch(
  "/profile-img",
  upload.single("profileImg"),
  auth(Role.ADMIN, Role.MANAGER, Role.OWNER, Role.TENANT),
  authController.updateProfileImg,
);

export const authRouter = router;
