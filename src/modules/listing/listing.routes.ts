import { Router } from "express";
import { listingController } from "./listing.controller";
import { auth } from "../auth/middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router ();
router.post("/",auth(Role.OWNER),listingController.createListing)
router.get("/",listingController.getAllListing)
router.get("/",listingController.getSingleListing)
router.patch("/",listingController.updateListing)
router.delete("/",listingController.deleteListing)
router.patch("/",listingController.uploadListingImg)


export const listingRoutes = router;