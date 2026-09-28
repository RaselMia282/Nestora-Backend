import { Router } from "express";
import { propertyCategoryController } from "./propertyCategory.controller";

const router = Router();
router.post("/",propertyCategoryController.createPropertyCategory);
router.get("/",propertyCategoryController.getAllPropertyCategory);
router.get("/:id",propertyCategoryController.getPropertyCategoryById);
router.patch("/:id",propertyCategoryController.updatePropertyCategory);
router.delete("/:id",propertyCategoryController.deletePropertyCategory)




export const propertyCategory = router;