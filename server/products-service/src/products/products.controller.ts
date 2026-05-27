import { NextFunction, Request, Response } from 'express';

class ProductsController {
  public async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (e) {
      next(e);
    }
  }
  public async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (e) {
      next(e);
    }
  }

  public async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (e) {
      next(e);
    }
  }

  public async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (e) {
      next(e);
    }
  }

  public async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (e) {
      next(e);
    }
  }
}

export const productsController = new ProductsController();
