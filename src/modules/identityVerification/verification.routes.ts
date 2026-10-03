import { Router } from "express";
import { verificationController } from "./verification.controller";
import { upload } from "../../lib/multer";

const router = Router();
router.post(
  "/",
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

export const nidVerificationRoutes = router;
