import { Router } from "express";
import { propertyCategoryController } from "./propertyCategory.controller";

const router = Router();
router.post("/",propertyCategoryController.createPropertyCategory);
router.get("/",propertyCategoryController.getAllPropertyCategory);
router.get("/:id",propertyCategoryController.getPropertyCategoryById)




export const propertyCategory = router;