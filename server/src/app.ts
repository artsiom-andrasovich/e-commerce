import { router as categoriesRoutes } from '@categories/categories.route';
import { errorMiddleware } from '@middlewares';
import express, { Application } from 'express';

const app: Application = express();
app.use(express.json());

app.use('/categories', categoriesRoutes);

app.use(errorMiddleware);

export default app;
