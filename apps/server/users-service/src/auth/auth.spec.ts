import { User } from "@users/model";
import request from "supertest";
import app from "../app";

describe("Auth Routes", () => {
  describe("POST /api/auth/sign-up", () => {
    it("Have to register a new user in the best scenario", async () => {
      const res = await request(app).post("/api/auth/sign-up").send({
        email: "user@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
      });

      expect(res.status).toBe(201);
      expect(res.body.user).toEqual(
        expect.objectContaining({
          email: "user@example.com",
          firstName: "John",
          lastName: "Doe",
        }),
      );
      expect(res.body.user.password).toBeUndefined();
      expect(res.body.accessToken).toBeDefined();
      expect(res.headers["set-cookie"]).toEqual(
        expect.arrayContaining([expect.stringMatching(/refreshToken=/)]),
      );
    });

    it("Have to create and link address if provided during sign up", async () => {
      const res = await request(app)
        .post("/api/auth/sign-up")
        .send({
          email: "user@example.com",
          password: "password123",
          firstName: "John",
          address: {
            country: "USA",
            city: "New York",
            street: "Broadway",
            zipCode: "10001",
          },
        });

      expect(res.status).toBe(201);

      const checkUser = await User.findOne({
        email: "user@example.com",
      }).populate("addresses");
      expect(checkUser).toBeDefined();
      expect(checkUser!.addresses).toHaveLength(1);

      const address = checkUser!.addresses[0] as any;
      expect(address.country).toBe("USA");
      expect(address.city).toBe("New York");
      expect(address.street).toBe("Broadway");
    });

    it("Have to throw 409 Conflict if email already exists", async () => {
      await User.create({
        email: "existing@example.com",
        password: "hashed_password",
      });

      const res = await request(app).post("/api/auth/sign-up").send({
        email: "existing@example.com",
        password: "password123",
      });

      expect(res.status).toBe(409);
    });

    it("Have to throw 400 if validation fails", async () => {
      const res = await request(app).post("/api/auth/sign-up").send({
        email: "someString",
        password: "123",
      });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/sign-in", () => {
    it("Have to login user and return tokens in the best scenario", async () => {
      await request(app).post("/api/auth/sign-up").send({
        email: "user@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/sign-in").send({
        email: "user@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.accessToken).toBeDefined();
      expect(res.headers["set-cookie"]).toEqual(
        expect.arrayContaining([expect.stringMatching(/refreshToken=/)]),
      );
    });

    it("Have to throw 401 Unauthorized if password is wrong", async () => {
      await request(app).post("/api/auth/sign-up").send({
        email: "user@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/sign-in").send({
        email: "user@example.com",
        password: "wrong123",
      });

      expect(res.status).toBe(401);
    });
  });
});
