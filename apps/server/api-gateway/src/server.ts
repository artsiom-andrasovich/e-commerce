import { env, logger } from "@configs";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import expressWinston from "express-winston";
import helmet from "helmet";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = env.API_GATEWAY_PORT || 3000;

app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: env.CLIENT_URL,
  }),
);

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    colorize: false,
  }),
);

app.use(
  createProxyMiddleware({
    pathFilter: "/api/categories",
    target: env.PRODUCTS_SERVICE_URL,
    changeOrigin: true,
  }),
);

app.use(
  createProxyMiddleware({
    pathFilter: "/api/products",
    target: env.PRODUCTS_SERVICE_URL,
    changeOrigin: true,
  }),
);

app.use(
  createProxyMiddleware({
    pathFilter: "/api/users",
    target: env.USERS_SERVICE_URL,
    changeOrigin: true,
  }),
);

app.use(
  createProxyMiddleware({
    pathFilter: "/api/auth",
    target: env.USERS_SERVICE_URL,
    changeOrigin: true,
  }),
);

app.use(
  createProxyMiddleware({
    pathFilter: "/api/upload",
    target: env.UPLOADS_SERVICE_URL,
    changeOrigin: true,
  }),
);

app.use(
  createProxyMiddleware({
    pathFilter: "/api/orders",
    target: env.ORDERS_SERVICE_URL,
    changeOrigin: true,
  }),
);

app.use(
  createProxyMiddleware({
    pathFilter: "/api/cart",
    target: env.ORDERS_SERVICE_URL,
    changeOrigin: true,
  }),
);

app.use((req, res) => {
  res.status(404).json({ message: "Gateway: Route not found" });
});

app.use(
  expressWinston.errorLogger({
    winstonInstance: logger,
  }),
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  res.status(500).json({ message: "Internal gateway error" });
});

app.listen(PORT, () => {
  logger.info(`API Gateway started on port = ${PORT}`);
});
