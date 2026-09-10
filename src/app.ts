import express, { type Application, type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config/index.js";


const app: Application = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("practices cloudinary,multer,redis etc");
});



export default app;
