import { Router } from "express";
import { roomController } from "./room.controller";
import { upload } from "../../lib/multer";

const router = Router();
router.post("/",roomController.createRoom);
router.get("/",roomController.getAllRoom);
router.get("/",roomController.getSingleRoom);
router.patch("/:id",roomController.updateRoom);
router.delete("/:id",roomController.deleteRoom);
router.patch("/:id/image",upload.single("roomImg"),roomController.uploadRoomImg);



export const roomRoutes = router;
    