import { logger } from "@configs";
import { errorMiddleware } from "@middlewares";
import { router as usersRoutes } from "@users/users.route";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { Application } from "express";
import expressWinston from "express-winston";
import { router as authRoutes } from "./auth/auth.route";

dotenv.config();

const app: Application = express();

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    colorize: false,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);

app.use(
  expressWinston.errorLogger({
    winstonInstance: logger,
  }),
);

app.use(errorMiddleware);

export default app;
