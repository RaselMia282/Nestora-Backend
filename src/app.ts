import express, { type Application, type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config/index.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { propertyCategory } from "./modules/propertyCategory/propertyCategory.routes.js";


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


app.use("/api/v1/auth",authRouter)
app.use("/api/v1/property-categories",propertyCategory)


export default app;
