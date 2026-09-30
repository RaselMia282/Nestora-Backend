import { Router } from "express";
import { roomController } from "./room.controller";

const router = Router();
router.post("/",roomController.createRoom)



export const roomRoutes = router;
    