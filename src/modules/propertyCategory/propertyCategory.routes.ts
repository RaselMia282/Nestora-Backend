import { Router } from "express";
import { propertyCategoryController } from "./propertyCategory.controller";
import { upload } from "../../lib/multer";

const router = Router();
router.post("/", propertyCategoryController.createPropertyCategory);
router.get("/", propertyCategoryController.getAllPropertyCategory);
router.get("/:id", propertyCategoryController.getPropertyCategoryById);
router.patch("/:id", propertyCategoryController.updatePropertyCategory);
router.delete("/:id", propertyCategoryController.deletePropertyCategory);
router.patch(
  "/:id/image",
  upload.single("categoryImg"),
  propertyCategoryController.updatePropertyCategoryImage,
);

export const propertyCategoryRoutes = router;
