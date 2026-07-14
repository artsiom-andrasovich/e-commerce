import { logger } from "@configs";
import { authMiddleware, errorMiddleware } from "@middlewares";
import { router as cartRoutes } from "@cart/cart.route";
import { router as ordersRoutes } from "@orders/orders.route";
import dotenv from "dotenv";
import express, { Application } from "express";
import expressWinston from "express-winston";

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

app.use("/api", authMiddleware);
app.use("/api/orders", ordersRoutes);
app.use("/api/cart", cartRoutes);

app.use(
  expressWinston.errorLogger({
    winstonInstance: logger,
  }),
);

app.use(errorMiddleware);

export default app;
