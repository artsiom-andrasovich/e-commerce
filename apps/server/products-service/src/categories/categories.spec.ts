import request from "supertest";
import app from "../app";
import { Category } from "./model";

describe("GET /api/categories", () => {
  it("Have to send status 200 and return empty array if db is empty", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: [],
        nextCursor: null,
      }),
    );
  });

  it("Have to return array of categories, only if they are into DB", async () => {
    await Category.create({ name: "Laptops" });
    await Category.create({ name: "Phones" });

    const res = await request(app).get("/api/categories");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it("Have to return correct pages with cursor (limit = 2, total = 3)", async () => {
    await Category.create({ name: "Laptops" });
    await Category.create({ name: "Smartphones" });
    await Category.create({ name: "Tablets" });

    const resPage1 = await request(app).get("/api/categories?limit=2");

    expect(resPage1.status).toBe(200);
    expect(resPage1.body.data).toHaveLength(2);

    expect(resPage1.body.data[0].name).toBe("Laptops");
    expect(resPage1.body.data[1].name).toBe("Smartphones");

    expect(resPage1.body.nextCursor).toBeDefined();
    expect(resPage1.body.nextCursor).not.toBeNull();

    const cursor = resPage1.body.nextCursor;

    const resPage2 = await request(app).get(
      `/api/categories?limit=2&cursor=${cursor}`,
    );

    expect(resPage2.status).toBe(200);

    expect(resPage2.body.data).toHaveLength(1);
    expect(resPage2.body.data[0].name).toBe("Tablets");

    expect(resPage2.body.nextCursor).toBeNull();
  });

  it("Have to throw 400 if limit is 0", async () => {
    const res = await request(app).get("/api/categories?limit=0");

    expect(res.status).toBe(400);
  });

  it("Have to throw 400 if limit is negative", async () => {
    const res = await request(app).get("/api/categories?limit=-5");

    expect(res.status).toBe(400);
  });

  it("Have to throw 400 if limit exceeds max (100)", async () => {
    const res = await request(app).get("/api/categories?limit=101");

    expect(res.status).toBe(400);
  });
});

describe("POST /api/categories", () => {
  it("Have to create a new category if category with this name does not exits", async () => {
    const newCategory = { name: "Laptops" };

    const res = await request(app).post("/api/categories").send(newCategory);
    expect(res.status).toBe(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        name: "Laptops",
      }),
    );
  });

  it("Have to throw an error after try of creating category with the conflict name", async () => {
    await Category.create({ name: "Laptops" });

    const newCategory = { name: "Laptops" };

    const res = await request(app).post("/api/categories").send(newCategory);

    expect(res.status).toBe(409);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Category with this name already exists",
      }),
    );
  });

  it("Have to throw 400 if name is empty", async () => {
    const res = await request(app).post("/api/categories").send({ name: "" });

    expect(res.status).toBe(400);
  });

  it("Have to throw 400 if name is longer than 30 characters", async () => {
    const res = await request(app)
      .post("/api/categories")
      .send({ name: "a".repeat(31) });

    expect(res.status).toBe(400);
  });

  it("Have to throw 400 if body is missing", async () => {
    const res = await request(app).post("/api/categories").send({});

    expect(res.status).toBe(400);
  });
});

describe("PUT /api/categories", () => {
  it("Have to change name in the best scenario without conflicts", async () => {
    await Category.create({ name: "Laptops" });

    const categoryId = (await request(app).get("/api/categories")).body.data[0]
      .id;

    const res = await request(app)
      .put(`/api/categories/${categoryId}`)
      .send({ name: "Phones" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: categoryId,
        name: "Phones",
      }),
    );
  });

  it("Have to throw Not Found if no category with this id", async () => {
    const res = await request(app)
      .put("/api/categories/6a1086bc3fbf67a9fb630fb4")
      .send({ name: "Phones" });

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Category with id 6a1086bc3fbf67a9fb630fb4 does not exist",
      }),
    );
  });

  it("Have to throw 400 if categoryId is not a valid ObjectId", async () => {
    const res = await request(app)
      .put("/api/categories/not-an-objectid")
      .send({ name: "Phones" });

    expect(res.status).toBe(400);
  });

  it("Have to throw 400 if name is empty", async () => {
    const res = await request(app)
      .put("/api/categories/6a1086bc3fbf67a9fb630fb4")
      .send({ name: "" });

    expect(res.status).toBe(400);
  });

  it("Have to throw 400 if name is longer than 30 characters", async () => {
    const res = await request(app)
      .put("/api/categories/6a1086bc3fbf67a9fb630fb4")
      .send({ name: "A".repeat(31) });

    expect(res.status).toBe(400);
  });

  it("Have to throw 400 if body is missing", async () => {
    const res = await request(app)
      .put("/api/categories/6a1086bc3fbf67a9fb630fb4")
      .send({});

    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/categories", () => {
  it("Have to delete via id in the best scenario", async () => {
    await Category.create({ name: "Laptops" });

    const categoryId = (await request(app).get("/api/categories")).body.data[0]
      .id;

    const res = await request(app).delete(`/api/categories/${categoryId}`);
    expect(res.status).toBe(204);

    const allCategories = await request(app).get("/api/categories");

    expect(allCategories.status).toBe(200);
    expect(allCategories.body).toEqual(
      expect.objectContaining({
        data: [],
        nextCursor: null,
      }),
    );
  });

  it("Have to throw Not Found if no category with this id", async () => {
    const res = await request(app).delete(
      `/api/categories/6a1086bc3fbf67a9fb630fb4`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Category with id 6a1086bc3fbf67a9fb630fb4 does not exist",
      }),
    );
  });

  it("Have to throw 400 if categoryId is not a valid ObjectId", async () => {
    const res = await request(app).delete("/api/categories/not-an-objectid");

    expect(res.status).toBe(400);
  });
});
