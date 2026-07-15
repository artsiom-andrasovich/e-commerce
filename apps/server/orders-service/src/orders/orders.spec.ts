import { NextFunction, Request, Response } from "express";
import request from "supertest";
import app from "../app";
import { Cart } from "../cart/model";
import { Order } from "./model";

jest.mock("@middlewares/auth.middleware", () => ({
  authMiddleware: (req: Request, res: Response, next: NextFunction) => {
    req.user = { id: "userId", email: "user@example.com", role: "USER" };
    next();
  },
}));

jest.mock("stripe", () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      checkout: {
        sessions: {
          create: jest.fn().mockResolvedValue({
            id: "stripe-session-id",
            url: "https://checkout.stripe.com/test",
          }),
        },
      },
    })),
  };
});

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/orders", () => {
  const mockProductId = "60c72b2f9b1d8b001c8e4a11";

  const validOrderDto = {
    deliveryMethod: "COURIER",
    paymentMethod: "CASH",
    billingInfo: {
      firstName: "John",
      lastName: "Doe",
      country: "USA",
      city: "NY",
      zipCode: "10001",
      street: "Broadway",
    },
  };

  it("Have to throw 400 if cart is empty", async () => {
    const res = await request(app).post("/api/orders").send(validOrderDto);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Cart is empty");
  });

  it("Have to create order with CASH payment method and clear cart", async () => {
    await Cart.create({
      userId: "userId",
      items: [{ productId: mockProductId, quantity: 2 }],
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        price: 100,
        title: "Test Product",
      }),
    });

    const res = await request(app).post("/api/orders").send(validOrderDto);

    expect(res.status).toBe(201);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.status).toBe("PENDING");
    expect(res.body.order.totalAmount).toBe(200);
    expect(res.body.checkoutUrl).toBeUndefined();

    const cart = await Cart.findOne({ userId: "userId" });
    expect(cart?.items).toHaveLength(0);
  });

  it("Have to create Stripe checkout session and return checkoutUrl if payment method is STRIPE", async () => {
    await Cart.create({
      userId: "userId",
      items: [{ productId: mockProductId, quantity: 1 }],
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        price: 50,
        title: "Stripe Product",
      }),
    });

    const res = await request(app)
      .post("/api/orders")
      .send({ ...validOrderDto, paymentMethod: "STRIPE" });

    expect(res.status).toBe(201);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.stripeSessionId).toBe("stripe-session-id");
    expect(res.body.checkoutUrl).toBe("https://checkout.stripe.com/test");

    const cart = await Cart.findOne({ userId: "userId" });
    expect(cart?.items).toHaveLength(0);
  });
});

describe("GET /api/orders", () => {
  it("Have to return user's orders with correct pagination", async () => {
    for (let i = 0; i < 3; i++) {
      await Order.create({
        userId: "userId",
        items: [
          {
            productId: `60c72b2f9b1d8b001c8e4a1${i}`,
            quantity: 1,
            priceAtPurchase: 10 * (i + 1),
            currencyAtPurchase: "USD",
          },
        ],
        totalAmount: 10 * (i + 1),
        currency: "USD",
        status: "PENDING",
        deliveryMethod: "COURIER",
        paymentMethod: "CASH",
        billingInfo: {
          firstName: "John",
          lastName: "Doe",
          country: "USA",
          city: "NY",
          zipCode: "10001",
          street: "Broadway",
        },
      });
    }

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        title: "Order Product",
      }),
    });

    const resPage1 = await request(app).get(
      "/api/orders/my-orders?limit=2&page=1",
    );
    expect(resPage1.status).toBe(200);
    expect(resPage1.body.data).toHaveLength(2);
    expect(resPage1.body.nextPage).toBe(2);

    const resPage2 = await request(app).get(
      "/api/orders/my-orders?limit=2&page=2",
    );
    expect(resPage2.status).toBe(200);
    expect(resPage2.body.data).toHaveLength(1);
    expect(resPage2.body.nextPage).toBeNull();
  });
});
