import { router as categoriesRoutes } from '@categories/categories.route';
import express, { Application } from 'express';

const app: Application = express();
app.use(express.json());
app.use('/categories', categoriesRoutes);

export default app;
