import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config/index.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { propertyCategory } from "./modules/propertyCategory/propertyCategory.routes.js";
import { propertyRoutes } from "./modules/property/property.router.js";
import { roomRoutes } from "./modules/room/room.routes.js";
import { listingRoutes } from "./modules/listing/listing.routes.js";
import { applicationRoutes } from "./modules/application/application.routes.js";
import { nidVerificationRoutes } from "./modules/identityVerification/verification.routes.js";
import { leaseRoutes } from "./modules/lease/lease.router.js";

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
  res.send("Housing and Rental Platform");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/property-categories", propertyCategory);
app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/room", roomRoutes);
app.use("/api/v1/listing", listingRoutes);
app.use("/api/v1/application", applicationRoutes);
app.use("/api/v1/verification", nidVerificationRoutes);
app.use("/api/v1/lease", leaseRoutes);

export default app;
