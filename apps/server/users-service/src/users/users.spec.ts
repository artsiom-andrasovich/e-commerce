import request from "supertest";
import app from "../app";
import { User } from "./model";

describe("GET /api/users/:userId", () => {
  it("Have to return user via id in the best scenario", async () => {
    const user = await User.create({
      email: "user@example.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    });

    const res = await request(app).get(`/api/users/${user.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: user.id,
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
      }),
    );
  });

  it("Have to not return password field in the response", async () => {
    const user = await User.create({
      email: "john@example.com",
      password: "password123",
    });

    const res = await request(app).get(`/api/users/${user.id}`);

    expect(res.status).toBe(200);
    expect(res.body.password).toBeUndefined();
  });

  it("Have to throw Not Found if no user with this id", async () => {
    const fakeId = "6a1086bc3fbf67a9fb630fb4";

    const res = await request(app).get(`/api/users/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: `User with this id ${fakeId} does not exist`,
      }),
    );
  });

  it("Have to throw 400 if userId is not a valid ObjectId", async () => {
    const res = await request(app).get("/api/users/something");

    expect(res.status).toBe(400);
  });
});
