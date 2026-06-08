import { TGetCategoriesQuery, TUpdateCategory } from "@app/lib-shared-types";
import { NextFunction, Request, Response } from "express";
import { categoriesService } from "./categories.service";
class CategoriesController {
  public async getCategories(
    req: Request<any, any, any, TGetCategoriesQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { limit, cursor } = req.query;

      const categories = await categoriesService.getCategories(limit, cursor);
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
      await categoriesService.deleteCategory(id as string);
      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId: id } = req.params;
      const dto: TUpdateCategory = req.body;
      const updatedCategory = await categoriesService.updateCategory(
        id as string,
        dto,
      );
      return res.status(200).json(updatedCategory);
    } catch (e) {
      next(e);
    }
  }
}

export const categoriesController = new CategoriesController();
