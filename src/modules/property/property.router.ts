import { Router } from "express";
import { propertyController } from "./property.controller";

const router = Router();
router.post("/",propertyController.createProperty)


export const propertyRoutes = router;
