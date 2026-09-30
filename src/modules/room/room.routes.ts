import { Router } from "express";
import { roomController } from "./room.controller";

const router = Router();
router.post("/",roomController.createRoom);
router.get("/",roomController.getAllRoom)



export const roomRoutes = router;
    