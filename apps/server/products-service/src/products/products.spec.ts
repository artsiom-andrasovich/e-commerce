import { Category } from "@categories/model";
import request from "supertest";
import app from "../app";
import { Product } from "./model";

describe("GET /api/products", () => {
  it("Have to send status 200 and return empty array if db is empty", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: [],
        nextCursor: null,
      })
    );
  });

  it("Have to return array of products, only if they are into DB", async () => {
    const category = await Category.create({ name: "Laptops" });
    await Product.create({
      title: "MacBook Air",
      price: 1000,
      categoryId: category._id,
    });
    await Product.create({
      title: "Dell XPS",
      price: 1200,
      categoryId: category._id,
    });

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it("Have to return correct pages with cursor (limit = 2, total = 3)", async () => {
    const category = await Category.create({ name: "Laptops" });
    await Product.create({
      title: "MacBook Air",
      price: 1000,
      categoryId: category._id,
    });
    await Product.create({
      title: "Smartphones",
      price: 800,
      categoryId: category._id,
    });
    await Product.create({
      title: "Tablets",
      price: 600,
      categoryId: category._id,
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
      `/api/products?limit=2&cursor=${cursor}`
    );

    expect(resPage2.status).toBe(200);

    expect(resPage2.body.data).toHaveLength(1);
    expect(resPage2.body.data[0].title).toBe("Tablets");

    expect(resPage2.body.nextCursor).toBeNull();
  });
});

describe("GET /api/products/:id", () => {
  it("Have to return product via id in the best scenario", async () => {
    const category = await Category.create({ name: "Laptops" });
    const product = await Product.create({
      title: "MacBook Pro",
      price: 2000,
      categoryId: category._id,
    });

    const res = await request(app).get(`/api/products/${product._id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        _id: product._id.toString(),
        title: "MacBook Pro",
        price: 2000,
      })
    );
  });

  it("Have to throw Not Found if no product with this _id", async () => {
    const fakeId = "6a1086bc3fbf67a9fb630fb4";
    const res = await request(app).get(`/api/products/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: `Product with this _id ${fakeId} does not exists`,
      })
    );
  });
});

describe("POST /api/products", () => {
  it("Have to create a new product if product with this title does not exits", async () => {
    const category = await Category.create({ name: "Laptops" });
    const newProduct = {
      title: "MacBook Air",
      price: 1000,
      categoryId: category._id,
    };

    const res = await request(app).post("/api/products").send(newProduct);
    expect(res.status).toBe(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        title: "MacBook Air",
      })
    );
  });
});

describe("PATCH /api/products", () => {
  it("Have to change title in the best scenario without conflicts", async () => {
    const category = await Category.create({ name: "Laptops" });
    await Product.create({
      title: "MacBook Air",
      price: 1000,
      categoryId: category._id,
    });

    const product_id = (await request(app).get("/api/products")).body.data[0]
      ._id;
    const updateProductDto = {
      _id: product_id,
      title: "Dell XPS",
    };

    const res = await request(app)
      .patch(`/api/products`)
      .send(updateProductDto);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        _id: updateProductDto._id,
        title: updateProductDto.title,
      })
    );
  });

  it("Have to throw Not Found if no product with this _id", async () => {
    const updateProductDto = {
      _id: "6a1086bc3fbf67a9fb630fb4",
      title: "Dell XPS",
    };
    const res = await request(app)
      .patch(`/api/products`)
      .send(updateProductDto);

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message:
          "Product with this _id 6a1086bc3fbf67a9fb630fb4 does not exists",
      })
    );
  });
});

describe("DELETE /api/products", () => {
  it("Have to delete via id in the best scenario", async () => {
    const category = await Category.create({ name: "Laptops" });
    await Product.create({
      title: "MacBook Air",
      price: 1000,
      categoryId: category._id,
    });

    const product_id = (await request(app).get("/api/products")).body.data[0]
      ._id;

    const res = await request(app).delete(`/api/products/${product_id}`);
    expect(res.status).toBe(204);

    const allProducts = await request(app).get("/api/products");

    expect(allProducts.status).toBe(200);
    expect(allProducts.body).toEqual(
      expect.objectContaining({
        data: [],
        nextCursor: null,
      })
    );
  });

  it("Have to throw Not Found if no product with this _id", async () => {
    const res = await request(app).delete(
      `/api/products/6a1086bc3fbf67a9fb630fb4`
    );

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message:
          "Product with this _id 6a1086bc3fbf67a9fb630fb4 does not exists",
      })
    );
  });
});
