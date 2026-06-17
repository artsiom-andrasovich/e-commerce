import {
  TCreateProduct,
  TGetProductsQuery,
  TUpdateProduct,
} from "@app/lib-shared-types";
import { NextFunction, Request, Response } from "express";
import { productsService } from "./products.service";

class ProductsController {
  public async getProducts(
    req: Request<any, any, any, TGetProductsQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { limit, cursor, categoryId, search } = req.query;
      const products = await productsService.getProducts(
        categoryId,
        limit,
        cursor,
        search,
      );
      return res.status(200).json(products);
    } catch (e) {
      next(e);
    }
  }
  public async getProduct(
    req: Request<{ productId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { productId } = req.params;
      const product = await productsService.getProduct(productId);
      return res.status(200).json(product);
    } catch (e) {
      next(e);
    }
  }

  public async createProduct(
    req: Request<any, any, TCreateProduct>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto = req.body;
      const newProduct = await productsService.createProduct(dto);
      return res.status(201).json(newProduct);
    } catch (e) {
      next(e);
    }
  }

  public async deleteProduct(
    req: Request<{ productId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { productId } = req.params;
      await productsService.deleteProduct(productId);
      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async updateProduct(
    req: Request<{ productId: string }, any, TUpdateProduct>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto = req.body;
      const { productId } = req.params;
      const updatedProduct = await productsService.updateProduct(
        productId,
        dto,
      );
      return res.status(200).json(updatedProduct);
    } catch (e) {
      next(e);
    }
  }
}

export const productsController = new ProductsController();
