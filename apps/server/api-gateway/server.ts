import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:5050",
  })
);

app.use(
  createProxyMiddleware({
    pathFilter: "/api/categories",
    target: process.env.PRODUCTS_SERVICE_URL || "http://localhost:3001",
    changeOrigin: true,
  })
);

app.use(
  createProxyMiddleware({
    pathFilter: "/api/upload",
    target: process.env.UPLOADS_SERVICE_URL || "http://localhost:3005",
    changeOrigin: true,
  })
);

app.use((req, res) => {
  res.status(404).json({ message: "Gateway: Route not found" });
});

app.listen(PORT, () => {
  console.log(`API Gateway started on port = ${PORT}`);
});
