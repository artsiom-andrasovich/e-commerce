import { router as categoriesRoutes } from "@categories/categories.route";
import { router as productsRoutes } from "./products/products.route";
import { logger } from "@configs";
import { errorMiddleware } from "@middlewares";
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

app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productsRoutes);

app.use(
	expressWinston.errorLogger({
		winstonInstance: logger,
	}),
);

app.use(errorMiddleware);

export default app;
