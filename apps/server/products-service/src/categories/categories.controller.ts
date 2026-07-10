import {
  TCreateCategory,
  TGetCategoriesQuery,
  TUpdateCategory,
  getCategoriesQuery,
} from "@app/lib-shared-types";
import { NextFunction, Request, Response } from "express";
import { categoriesService } from "./categories.service";
class CategoriesController {
  public async getCategories(
    req: Request<any, any, any, TGetCategoriesQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { limit, page, lang } = getCategoriesQuery.parse(req.query);

      const categories = await categoriesService.getCategories(
        limit,
        page,
        lang,
      );
      return res.status(200).json(categories);
    } catch (e) {
      next(e);
    }
  }

  public async createCategory(
    req: Request<any, any, TCreateCategory>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto = req.body;
      const newCategory = await categoriesService.createCategory(dto);
      return res.status(201).json(newCategory);
    } catch (e) {
      next(e);
    }
  }

  public async deleteCategory(
    req: Request<{ categoryId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { categoryId } = req.params;
      await categoriesService.deleteCategory(categoryId);
      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async updateCategory(
    req: Request<{ categoryId: string }, any, TUpdateCategory>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { categoryId } = req.params;
      const dto: TUpdateCategory = req.body;
      const updatedCategory = await categoriesService.updateCategory(
        categoryId,
        dto,
      );
      return res.status(200).json(updatedCategory);
    } catch (e) {
      next(e);
    }
  }
}

export const categoriesController = new CategoriesController();
