import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../auth/middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();
router.post("/",auth(Role.OWNER),propertyController.createProperty);
router.get("/",auth(Role.OWNER),propertyController.getAllProperties);


export const propertyRoutes = router;
