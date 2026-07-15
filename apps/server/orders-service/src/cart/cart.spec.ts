import { NextFunction, Request, Response } from "express";
import request from "supertest";
import app from "../app";
import { Cart } from "./model";

jest.mock("@middlewares/auth.middleware", () => ({
  authMiddleware: (req: Request, res: Response, next: NextFunction) => {
    req.user = { id: "userId", email: "user@example.com", role: "USER" };
    next();
  },
}));

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/cart", () => {
  const validProductId = "60c72b2f9b1d8b001c8e4a11";

  it("Have to return an empty cart if one does not exist and create it", async () => {
    const res = await request(app).get("/api/cart");

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(0);
    expect(res.body.userId).toBe("userId");
  });

  it("Have to return populated cart if items exist", async () => {
    await Cart.create({
      userId: "userId",
      items: [{ productId: validProductId, quantity: 2 }],
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: validProductId,
        title: "Test Product",
        price: 100,
      }),
    });

    const res = await request(app).get("/api/cart");

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].product.title).toBe("Test Product");
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/cart", () => {
  const newProductId = "60c72b2f9b1d8b001c8e4a12";
  const existingProductId = "60c72b2f9b1d8b001c8e4a13";

  it("Have to add new product to cart", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: newProductId,
        title: "New Product",
        price: 50,
      }),
    });

    const res = await request(app).post("/api/cart").send({
      productId: newProductId,
      quantity: 1,
    });

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].productId).toBe(newProductId);
    expect(res.body.items[0].quantity).toBe(1);
  });

  it("Have to increase quantity if product is already in cart", async () => {
    await Cart.create({
      userId: "userId",
      items: [{ productId: existingProductId, quantity: 1 }],
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: existingProductId,
        title: "Existing Product",
        price: 50,
      }),
    });

    const res = await request(app).post("/api/cart").send({
      productId: existingProductId,
      quantity: 2,
    });

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].quantity).toBe(3);
  });
});

describe("DELETE /api/cart/:productId", () => {
  const productToRemoveId = "60c72b2f9b1d8b001c8e4a14";

  it("Have to remove product from cart", async () => {
    await Cart.create({
      userId: "userId",
      items: [{ productId: productToRemoveId, quantity: 1 }],
    });

    const res = await request(app).delete(`/api/cart/${productToRemoveId}`);

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(0);
  });

  it("Have to throw 404 if cart not found on delete", async () => {
    const missingId = "60c72b2f9b1d8b001c8e4a15";
    const res = await request(app).delete(`/api/cart/${missingId}`);

    expect(res.status).toBe(404);
  });
});
