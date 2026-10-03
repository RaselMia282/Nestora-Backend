import { Router } from "express";
import { verificationController } from "./verification.controller";
import { upload } from "../../lib/multer";
import { auth } from "../auth/middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();
router.post(
  "/",
  auth(Role.OWNER,Role.ADMIN,Role.TENANT,Role.MANAGER),
  upload.fields([
    {
      name: "nidFront",
      maxCount: 1,
    },
    {
      name: "nidBack",
      maxCount: 1,
    },
  ]),
  verificationController.verifyIdentity,
);

router.get("/me",auth(Role.ADMIN,Role.MANAGER,Role.OWNER,Role.TENANT),verificationController.getMyVerification);

router.get("/pending-list",auth(Role.ADMIN,Role.OWNER),verificationController.getPendingVerification);

router.patch("/:id/status",auth(Role.ADMIN,Role.OWNER),verificationController.updateVarificationStatus)


export const nidVerificationRoutes = router;
