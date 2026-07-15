import { TAddToCart } from "@app/lib-shared-types";
import { NextFunction, Request, Response } from "express";
import { cartService } from "./cart.service";

export class CartController {
  public async getCart(req: Request<any, any, any, { lang?: string; currency?: string }>, res: Response, next: NextFunction) {
    try {
      const { lang, currency } = req.query;
      const cart = await cartService.getCart(req.user!, lang, currency);
      return res.status(200).json(cart);
    } catch (e) {
      next(e);
    }
  }

  public async addToCart(
    req: Request<any, any, TAddToCart>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto = req.body;
      const cart = await cartService.addToCart(req.user!, dto);
      return res.status(200).json(cart);
    } catch (e) {
      next(e);
    }
  }

  public async updateCartItem(
    req: Request<any, any, TAddToCart>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto = req.body;
      const cart = await cartService.updateCartItemQuantity(req.user!, dto);
      return res.status(200).json(cart);
    } catch (e) {
      next(e);
    }
  }

  public async removeFromCart(
    req: Request<{ productId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { productId } = req.params;
      const cart = await cartService.removeFromCart(req.user!, productId);
      return res.status(200).json(cart);
    } catch (e) {
      next(e);
    }
  }
}

export const cartController = new CartController();
