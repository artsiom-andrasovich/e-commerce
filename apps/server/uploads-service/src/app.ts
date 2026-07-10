import dotenv from "dotenv";
dotenv.config();

import express, { type Application } from "express";
import expressWinston from "express-winston";
import { logger } from "./configs";
import { errorMiddleware } from "./middlewares";
import { router as uploadRouter } from "./upload/upload.route";

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
app.use("/api/upload", uploadRouter);

app.use(
  expressWinston.errorLogger({
    winstonInstance: logger,
  }),
);

app.use(errorMiddleware);

export default app;
