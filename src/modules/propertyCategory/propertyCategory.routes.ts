import { Router } from "express";
import { propertyCategoryController } from "./propertyCategory.controller";

const router = Router();
router.post("/",propertyCategoryController.createPropertyCategory);



export const propertyCategory = router;