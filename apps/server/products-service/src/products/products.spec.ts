import { Category } from "@categories/model";
import { NextFunction, Request, Response } from "express";
import request from "supertest";
import app from "../app";
import { Product } from "./model";

jest.mock("@middlewares/auth.middleware", () => ({
  authMiddleware: (req: Request, res: Response, next: NextFunction) => {
    req.user = { id: "userId", email: "user@example.com", role: "ADMIN" };
    next();
  },
}));

describe("GET /api/products", () => {
  it("Have to send status 200 and return empty array if db is empty", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: [],
        nextCursor: null,
      }),
    );
  });

  it("Have to return array of products, only if they are into DB", async () => {
    const category = await Category.create({
      name: { en: "Laptops", pl: "Laptops", de: "Laptops" },
    });
    await Product.create({
      title: { en: "MacBook Air", pl: "MacBook Air", de: "MacBook Air" },
      price: 1000,
      categoryId: category.id,
    });
    await Product.create({
      title: { en: "Dell XPS", pl: "Dell XPS", de: "Dell XPS" },
      price: 1200,
      categoryId: category.id,
    });

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it("Have to return correct pages with cursor (limit = 2, total = 3)", async () => {
    const category = await Category.create({
      name: { en: "Laptops", pl: "Laptops", de: "Laptops" },
    });
    await Product.create({
      title: { en: "MacBook Air", pl: "MacBook Air", de: "MacBook Air" },
      price: 1000,
      categoryId: category.id,
    });
    await Product.create({
      title: { en: "Smartphones", pl: "Smartphones", de: "Smartphones" },
      price: 800,
      categoryId: category.id,
    });
    await Product.create({
      title: { en: "Tablets", pl: "Tablets", de: "Tablets" },
      price: 600,
      categoryId: category.id,
    });

    const resPage1 = await request(app).get("/api/products?limit=2");

    expect(resPage1.status).toBe(200);
    expect(resPage1.body.data).toHaveLength(2);

    expect(resPage1.body.data[0].title).toBe("MacBook Air");
    expect(resPage1.body.data[1].title).toBe("Smartphones");

    expect(resPage1.body.nextCursor).toBeDefined();
    expect(resPage1.body.nextCursor).not.toBeNull();

    const cursor = resPage1.body.nextCursor;

    const resPage2 = await request(app).get(
      `/api/products?limit=2&cursor=${cursor}`,
    );

    expect(resPage2.status).toBe(200);

    expect(resPage2.body.data).toHaveLength(1);
    expect(resPage2.body.data[0].title).toBe("Tablets");

    expect(resPage2.body.nextCursor).toBeNull();
  });

  it("Have to return products matching the search query in title", async () => {
    const category = await Category.create({
      name: { en: "Laptops", pl: "Laptopy", de: "Laptops" },
    });
    await Product.create({
      title: { en: "MacBook Air", pl: "MacBook Air", de: "MacBook Air" },
      price: 1000,
      categoryId: category.id,
    });
    await Product.create({
      title: { en: "Dell XPS", pl: "Dell XPS", de: "Dell XPS" },
      price: 1200,
      categoryId: category.id,
    });

    const res = await request(app).get("/api/products?search=MacBook");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe("MacBook Air");
  });

  it("Have to return products matching the search query in description", async () => {
    const category = await Category.create({
      name: { en: "Accessories", pl: "Akcesoria", de: "Zubehör" },
    });
    await Product.create({
      title: { en: "Laptop Sleeve", pl: "Etui", de: "Laptoptasche" },
      description: {
        en: "High quality leather sleeve for 13 inch laptops",
        pl: "Wysokiej jakości",
        de: "Hochwertige",
      },
      price: 50,
      categoryId: category.id,
    });
    await Product.create({
      title: {
        en: "Wireless Mouse",
        pl: "Mysz bezprzewodowa",
        de: "Kabellose Maus",
      },
      description: {
        en: "Ergonomic plastic mouse",
        pl: "Ergonomiczna",
        de: "Ergonomische",
      },
      price: 30,
      categoryId: category.id,
    });

    const res = await request(app).get("/api/products?search=leather");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe("Laptop Sleeve");
  });

  it("Have to return empty array if no products match the search query", async () => {
    const category = await Category.create({
      name: { en: "Laptops", pl: "Laptopy", de: "Laptops" },
    });
    await Product.create({
      title: { en: "MacBook Air", pl: "MacBook Air", de: "MacBook Air" },
      price: 1000,
      categoryId: category.id,
    });

    const res = await request(app).get("/api/products?search=Samsung");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: [],
        nextCursor: null,
      }),
    );
  });

  it("Have to return imageKey as a single string (first element) in list response", async () => {
    const category = await Category.create({ name: { en: "Laptops" } });
    await Product.create({
      title: { en: "MacBook Air" },
      price: 1000,
      categoryId: category.id,
      imageKeys: ["products/dell.png", "products/dell-1.png"],
    });

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(typeof res.body.data[0].imageKey).toBe("string");
    expect(res.body.data[0].imageKey).toBe("products/dell.png");
  });

  it("Have to return null imageKey in list response when imageKey array is empty", async () => {
    const category = await Category.create({ name: { en: "Laptops" } });
    await Product.create({
      title: { en: "Product without image" },
      price: 500,
      categoryId: category.id,
      imageKeys: [],
    });

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].imageKey).toBeNull();
  });
});

describe("GET /api/products/:id", () => {
  it("Have to return product via id in the best scenario", async () => {
    const category = await Category.create({
      name: { en: "Laptops", pl: "Laptops", de: "Laptops" },
    });
    const product = await Product.create({
      title: { en: "MacBook Pro", pl: "MacBook Pro", de: "MacBook Pro" },
      price: 2000,
      categoryId: category.id,
    });

    const res = await request(app).get(`/api/products/${product.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: product.id.toString(),
        title: "MacBook Pro",
        price: 2000,
      }),
    );
  });

  it("Have to throw Not Found if no product with this id", async () => {
    const fakeId = "6a1086bc3fbf67a9fb630fb4";
    const res = await request(app).get(`/api/products/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: `Product with id ${fakeId} does not exist`,
      }),
    );
  });
});

describe("POST /api/products", () => {
  it("Have to create a new product if product with this title does not exits", async () => {
    const category = await Category.create({
      name: { en: "Laptops", pl: "Laptops", de: "Laptops" },
    });
    const newProduct = {
      title: { en: "MacBook Air", pl: "MacBook Air", de: "MacBook Air" },
      price: 1000,
      categoryId: category.id,
    };

    const res = await request(app).post("/api/products").send(newProduct);
    if (res.status !== 201) console.log(res.body);
    expect(res.status).toBe(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        title: { en: "MacBook Air", pl: "MacBook Air", de: "MacBook Air" },
      }),
    );
  });
});

describe("PATCH /api/products", () => {
  it("Have to change title in the best scenario without conflicts", async () => {
    const category = await Category.create({
      name: { en: "Laptops", pl: "Laptops", de: "Laptops" },
    });
    await Product.create({
      title: { en: "MacBook Air", pl: "MacBook Air", de: "MacBook Air" },
      price: 1000,
      categoryId: category.id,
    });

    const productId = (await request(app).get("/api/products")).body.data[0].id;
    const updateProductDto = {
      id: productId,
      title: { en: "Dell XPS", pl: "Dell XPS", de: "Dell XPS" },
    };

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send(updateProductDto);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: productId,
        title: updateProductDto.title,
      }),
    );
  });

  it("Have to throw Not Found if no product with this id", async () => {
    const fakeId = "6a1086bc3fbf67a9fb630fb4";
    const updateProductDto = {
      id: "6a1086bc3fbf67a9fb630fb4",
      title: { en: "Dell XPS", pl: "Dell XPS", de: "Dell XPS" },
    };
    const res = await request(app)
      .patch(`/api/products/${updateProductDto.id}`)
      .send(updateProductDto);

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Product with id 6a1086bc3fbf67a9fb630fb4 does not exist",
      }),
    );
  });
});

describe("DELETE /api/products", () => {
  it("Have to delete via id in the best scenario", async () => {
    const category = await Category.create({
      name: { en: "Laptops", pl: "Laptops", de: "Laptops" },
    });
    await Product.create({
      title: { en: "MacBook Air", pl: "MacBook Air", de: "MacBook Air" },
      price: 1000,
      categoryId: category.id,
    });

    const productId = (await request(app).get("/api/products")).body.data[0].id;

    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.status).toBe(204);

    const allProducts = await request(app).get("/api/products");

    expect(allProducts.status).toBe(200);
    expect(allProducts.body).toEqual(
      expect.objectContaining({
        data: [],
        nextCursor: null,
      }),
    );
  });

  it("Have to throw Not Found if no product with this id", async () => {
    const res = await request(app).delete(
      `/api/products/6a1086bc3fbf67a9fb630fb4`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Product with id 6a1086bc3fbf67a9fb630fb4 does not exist",
      }),
    );
  });
});
