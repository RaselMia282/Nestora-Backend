import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../auth/middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();
router.post("/", auth(Role.OWNER), propertyController.createProperty);
router.get("/", auth(Role.OWNER), propertyController.getAllProperties);

router.get("/:id", auth(Role.OWNER), propertyController.getSingleProperty);
router.patch("/:id",auth(Role.OWNER),propertyController.updateProperty)

export const propertyRoutes = router;
