import { router as categoriesRoutes } from '@categories/categories.route';
import { errorMiddleware } from '@middlewares';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import helmet from 'helmet';

dotenv.config();

const app: Application = express();

app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());

app.use('/categories', categoriesRoutes);

app.use(errorMiddleware);

export default app;
