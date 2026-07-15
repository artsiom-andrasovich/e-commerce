import {
  TCreateOrder,
  TJwtPayload,
  TProductListItem,
  TOrder,
} from "@app/lib-shared-types";
import { cartService, CartService } from "@cart/cart.service";
import { env, logger } from "@configs";
import { ApiError } from "@utils";
import Stripe from "stripe";
import { Order } from "./model";
import { mailService } from "@mail/mail.service";

export class OrdersService {
  private readonly stripe: Stripe;
  private readonly cartService: CartService;

  constructor(cartServiceInstance: CartService) {
    this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    });
    this.cartService = cartServiceInstance;
  }
  public async createOrder(
    user: TJwtPayload,
    dto: TCreateOrder,
    lang?: string,
    currency?: string,
  ) {
    const cart = await this.cartService.getCart(user, lang, currency);
    if (cart.items.length === 0) {
      throw ApiError.BadRequest("Cart is empty");
    }

    let totalAmount = 0;
    const orderCurrency = currency ?? "USD";
    const orderItems = [];
    const stripeLineItems = [];

    for (const item of cart.items) {
      if (!item.product) {
        throw ApiError.BadRequest(
          `Product ${item.productId} is unavailable or price could not be verified`,
        );
      }
      const priceAtPurchase = item.product.price;

      totalAmount += priceAtPurchase * item.quantity;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase,
        currencyAtPurchase: orderCurrency,
      });

      stripeLineItems.push({
        price_data: {
          currency: orderCurrency.toLowerCase(),
          product_data: {
            name: item.product.title,
          },
          unit_amount: Math.round(priceAtPurchase * 100),
        },
        quantity: item.quantity,
      });
    }

    const order = new Order({
      userId: user.id,
      items: orderItems,
      totalAmount,
      currency: orderCurrency,
      status: "PENDING",
      deliveryMethod: dto.deliveryMethod,
      paymentMethod: dto.paymentMethod,
      billingInfo: dto.billingInfo,
    });

    if (dto.paymentMethod === "STRIPE") {
      try {
        const session = await this.stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: stripeLineItems,
          mode: "payment",
          success_url: `${env.CLIENT_URL}/checkout/success?orderId=${order._id}`,
          cancel_url: `${env.CLIENT_URL}/checkout`,
          client_reference_id: order.id,
        });

        order.stripeSessionId = session.id;

        await order.save();
        await this.cartService.clearCart(user);

        const orderWithProducts = order.toJSON() as TOrder;
        orderWithProducts.items = orderWithProducts.items.map((item, index) => ({
          ...item,
          product: cart.items[index]?.product,
        }));
        mailService.sendOrderConfirmation(user.email, orderWithProducts);

        return { order, checkoutUrl: session.url };
      } catch (e) {
        logger.error("Stripe error:", e);
        throw ApiError.Internal("Payment provider error");
      }
    }

    await order.save();
    await this.cartService.clearCart(user);

    const orderWithProducts = order.toJSON() as TOrder;
    orderWithProducts.items = orderWithProducts.items.map((item, index) => ({
      ...item,
      product: cart.items[index]?.product,
    }));
    mailService.sendOrderConfirmation(user.email, orderWithProducts);

    return { order };
  }

  public async getMyOrders(user: TJwtPayload, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const orders = await Order.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1);

    const hasMore = orders.length > limit;
    const ordersToReturn = hasMore ? orders.slice(0, limit) : orders;

    const populatedOrders = await Promise.all(
      ordersToReturn.map(async (orderDoc) => {
        const order = orderDoc.toJSON();
        const items = await Promise.all(
          order.items.map(async (item) => {
            try {
              const res = await fetch(
                `${env.PRODUCTS_SERVICE_URL}/api/products/${item.productId}`,
              );
              if (res.ok) {
                const product = (await res.json()) as TProductListItem;
                return { ...item, product };
              }
            } catch (e) {
              console.error(e);
            }
            return item;
          }),
        );
        order.items = items;
        return order;
      }),
    );

    return {
      data: populatedOrders,
      nextPage: hasMore ? page + 1 : null,
    };
  }
  public async getOrderById(user: TJwtPayload, orderId: string) {
    const orderDoc = await Order.findById(orderId);
    if (!orderDoc) {
      throw ApiError.NotFound(`Order with id ${orderId} not found`);
    }

    if (orderDoc.userId !== user.id && user.role !== "ADMIN") {
      throw ApiError.Forbidden("You are not allowed to view this order");
    }

    const order = orderDoc.toJSON();
    const items = await Promise.all(
      order.items.map(async (item) => {
        try {
          const res = await fetch(
            `${env.PRODUCTS_SERVICE_URL}/api/products/${item.productId}`,
          );
          if (res.ok) {
            const product = (await res.json()) as TProductListItem;
            return { ...item, product };
          }
        } catch (e) {
          console.error(e);
        }
        return item;
      }),
    );
    order.items = items;
    return order;
  }
}

export const ordersService = new OrdersService(cartService);
