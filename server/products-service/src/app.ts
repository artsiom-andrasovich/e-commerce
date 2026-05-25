import { router as categoriesRoutes } from '@categories/categories.route';
import { errorMiddleware } from '@middlewares';
import dotenv from 'dotenv';
import express, { Application } from 'express';

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use('/api/categories', categoriesRoutes);

app.use(errorMiddleware);

export default app;
