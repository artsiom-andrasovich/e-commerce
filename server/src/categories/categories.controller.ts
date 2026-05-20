import { NextFunction, Request, Response } from 'express';
import { categoriesService } from './categories.service';
import { TUpdateCategory } from './dto';
class CategoriesController {
  public async getAllCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const categories = await categoriesService.getAllCategories();
      return res.status(200).json(categories);
    } catch (e) {
      next(e);
    }
  }

  public async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body;
      const newCategory = await categoriesService.createCategory(dto);
      return res.status(201).json(newCategory);
    } catch (e) {
      next(e);
    }
  }

  public async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId: id } = req.params;
      const newCategory = await categoriesService.deleteCategory(id as string);
      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  public async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: TUpdateCategory = req.body;
      const updatedCategory = await categoriesService.updateCategory(dto);
      return res.status(200).json(updatedCategory);
    } catch (e) {
      next(e);
    }
  }
}

export const categoriesController = new CategoriesController();
