import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../auth/middleware";
import { Role } from "../../generated/prisma/enums";
import { upload } from "../../lib/multer";

const router = Router();
router.post(
  "/",
  auth(Role.OWNER, Role.ADMIN),
  propertyController.createProperty,
);
router.get("/", propertyController.getAllProperties);

router.get("/:id", propertyController.getSingleProperty);
router.patch(
  "/:id/image",
  auth(Role.OWNER, Role.ADMIN),
  upload.single("propertyImg"),
  auth(Role.OWNER),
  propertyController.updateProperty,
);

export const propertyRoutes = router;
