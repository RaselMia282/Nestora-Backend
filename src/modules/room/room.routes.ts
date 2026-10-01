import { Router } from "express";
import { roomController } from "./room.controller";

const router = Router();
router.post("/",roomController.createRoom);
router.get("/",roomController.getAllRoom);
router.get("/",roomController.getSingleRoom);
router.patch("/",roomController.updateRoom);
router.delete("/",roomController.deleteRoom);
router.patch("/",roomController.uploadRoomImg);



export const roomRoutes = router;
    