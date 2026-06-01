import { TCreateProduct, TUpdateProduct } from "@app/lib-shared-types";
import { NextFunction, Request, Response } from "express";
import { productsService } from "./products.service";

class ProductsController {
  public async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const cursor = req.query.cursor as string | undefined;
      const categoryId = req.query.categoryId as string | undefined;
      const search = req.query.search as string | undefined;
      const products = await productsService.getProducts(
        categoryId,
        limit,
        cursor,
        search
      );
      return res.status(200).json(products);
    } catch (e) {
      next(e);
    }
  }
  public async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId: _id } = req.params;
      const product = await productsService.getProduct(_id as string);
      return res.status(200).json(product);
    } catch (e) {
      next(e);
    }
  }

  public async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: TCreateProduct = req.body;
      const newProduct = await productsService.createProduct(dto);
      return res.status(201).json(newProduct);
    } catch (e) {
      next(e);
    }
  }

  public async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId: _id } = req.params;
      const deletedProduct = await productsService.deleteProduct(_id as string);
      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: TUpdateProduct = req.body;
      const updatedProduct = await productsService.updateProduct(dto);
      return res.status(200).json(updatedProduct);
    } catch (e) {
      next(e);
    }
  }
}

export const productsController = new ProductsController();
