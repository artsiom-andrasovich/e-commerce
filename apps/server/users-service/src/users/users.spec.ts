import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import { User } from "./model";
import { env } from "../configs/env";

describe("GET /api/users/:userId", () => {
  it("Have to return user via id in the best scenario", async () => {
    const user = await User.create({
      email: "user@example.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: "USER" },
      env.JWT_ACCESS_SECRET,
    );

    const res = await request(app)
      .get(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: user.id,
        email: "user@example.com",
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

    const token = jwt.sign(
      { id: user.id, email: user.email, role: "USER" },
      env.JWT_ACCESS_SECRET,
    );

    const res = await request(app)
      .get(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.password).toBeUndefined();
  });

  it("Have to throw Not Found if no user with this id (called by admin)", async () => {
    const fakeId = "6a1086bc3fbf67a9fb630fb4";
    const token = jwt.sign(
      { id: "adminId", email: "admin@example.com", role: "ADMIN" },
      env.JWT_ACCESS_SECRET,
    );

    const res = await request(app)
      .get(`/api/users/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: `User with this id ${fakeId} does not exist`,
      }),
    );
  });

  it("Have to throw 403 Forbidden if non-admin fetches another user profile", async () => {
    const user = await User.create({
      email: "user1@example.com",
      password: "password123",
    });

    const token = jwt.sign(
      { id: "otherUserId", email: "other@example.com", role: "USER" },
      env.JWT_ACCESS_SECRET,
    );

    const res = await request(app)
      .get(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it("Have to succeed if admin fetches another user profile", async () => {
    const user = await User.create({
      email: "user2@example.com",
      password: "password123",
      firstName: "UserTwo",
    });

    const token = jwt.sign(
      { id: "adminId", email: "admin@example.com", role: "ADMIN" },
      env.JWT_ACCESS_SECRET,
    );

    const res = await request(app)
      .get(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe("UserTwo");
  });

  it("Have to throw 400 if userId is not a valid ObjectId", async () => {
    const token = jwt.sign(
      { id: "userId", email: "user@example.com", role: "USER" },
      env.JWT_ACCESS_SECRET,
    );

    const res = await request(app)
      .get("/api/users/something")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/users/:userId", () => {
  it("Have to update user data in the best scenario", async () => {
    const user = await User.create({
      email: "user@example.com",
      password: "password123",
      firstName: "John",
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: "USER" },
      env.JWT_ACCESS_SECRET,
    );

    const res = await request(app)
      .patch(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Jane",
        lastName: "Smith",
      });

    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe("Jane");
    expect(res.body.lastName).toBe("Smith");
  });

  it("Have to throw 403 Forbidden if updating another user", async () => {
    const user = await User.create({
      email: "user@example.com",
      password: "123",
    });

    const token = jwt.sign(
      { id: "6a1086bc3fbf67a9fb630fb4", email: "hacker@example.com", role: "USER" },
      env.JWT_ACCESS_SECRET,
    );

    const res = await request(app)
      .patch(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Hacked",
      });

    expect(res.status).toBe(403);
  });

  it("Have to succeed if admin updates another user profile", async () => {
    const user = await User.create({
      email: "user@example.com",
      password: "123",
      firstName: "BeforeAdmin",
    });

    const token = jwt.sign(
      { id: "adminId", email: "admin@example.com", role: "ADMIN" },
      env.JWT_ACCESS_SECRET,
    );

    const res = await request(app)
      .patch(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "AfterAdmin",
      });

    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe("AfterAdmin");
  });
});

describe("DELETE /api/users/:userId", () => {
  it("Have to delete user account in the best scenario", async () => {
    const user = await User.create({
      email: "user@example.com",
      password: "password123",
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: "USER" },
      env.JWT_ACCESS_SECRET,
    );

    const res = await request(app)
      .delete(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);

    const checkUser = await User.findById(user.id);
    expect(checkUser).toBeNull();
  });

  it("Have to throw 403 Forbidden if non-admin deletes another user account", async () => {
    const user = await User.create({
      email: "user@example.com",
      password: "password123",
    });

    const token = jwt.sign(
      { id: "otherUserId", email: "other@example.com", role: "USER" },
      env.JWT_ACCESS_SECRET,
    );

    const res = await request(app)
      .delete(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it("Have to succeed if admin deletes another user account", async () => {
    const user = await User.create({
      email: "user@example.com",
      password: "password123",
    });

    const token = jwt.sign(
      { id: "adminId", email: "admin@example.com", role: "ADMIN" },
      env.JWT_ACCESS_SECRET,
    );

    const res = await request(app)
      .delete(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);

    const checkUser = await User.findById(user.id);
    expect(checkUser).toBeNull();
  });
});
