import { Router } from "express";
import { authController } from "./auth.controller";
import { Role } from "../generated/prisma/enums";
import { auth } from "./middleware";

const router = Router();

router.post("/register",authController.registerUser)
router.post("/login",authController.loginUser)
router.get("/me",auth(Role.ADMIN,Role.MANAGER,Role.OWNER,Role.TENANT),authController.getMyProfile)


export const authRouter = router;