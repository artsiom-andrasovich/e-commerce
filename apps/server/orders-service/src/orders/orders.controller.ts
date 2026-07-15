import {
  getOrdersQuery,
  TCreateOrder,
  TGetOrdersQuery,
} from "@app/lib-shared-types";
import { NextFunction, Request, Response } from "express";
import { ordersService } from "./orders.service";

export class OrdersController {
  public async createOrder(
    req: Request<any, any, TCreateOrder, { lang?: string; currency?: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto = req.body;
      const { lang, currency } = req.query;
      const result = await ordersService.createOrder(req.user!, dto, lang, currency);
      return res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getMyOrders(
    req: Request<any, any, any, TGetOrdersQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { page, limit } = getOrdersQuery.parse(req.query);
      const orders = await ordersService.getMyOrders(req.user!, page, limit);
      return res.status(200).json(orders);
    } catch (e) {
      next(e);
    }
  }
}

export const ordersController = new OrdersController();
