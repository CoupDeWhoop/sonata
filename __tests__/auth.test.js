const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seed");
const data = require("../db/data");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("Authorization", () => {
  describe("POST /api/users", () => {
    test("201 - responds with the added user", async () => {
      const newUser = {
        user_name: "Harry",
        user_email: "haribo@hazbob.bob",
        user_password: "testPassword1234",
        instrument: "Harmonica",
      };
      const response = await request(app)
        .post("/api/users")
        .send(newUser)
        .expect(201);

      const {
        body: { user },
      } = response;
      expect(user).toMatchObject({
        user_id: expect.any(String),
        user_name: "Harry",
        user_email: "haribo@hazbob.bob",
        user_password: expect.any(String),
        instrument: "Harmonica",
      });
    });
    test("should reject a repeated user email address", async () => {
      const newUser = {
        user_name: "Harry",
        user_email: "testemail@test.com",
        user_password: "testPassword1234",
        instrument: "Trombonio",
      };
      const response = await request(app)
        .post("/api/users")
        .send(newUser)
        .expect(400);
    });
  });

  describe("POST /api/auth/login", () => {
    test("200 - user login succesful with valid credentials", async () => {
      const credentials = {
        email: "testemail@test.com",
        password: "Password123",
      };
      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(200);

      expect(response.body.tokens).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
    test("401 - invalid email provided during login", async () => {
      const credentials = {
        email: "test@test.com",
        password: "Password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(401);

      expect(response.body.msg).toBe("Email is incorrect");
    });
    test("401 - incorrect password provided during login", async () => {
      const credentials = {
        email: "testemail@test.com",
        password: "Password",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(401);

      const {
        body: { msg },
      } = response;
      expect(msg).toBe("Incorrect Password");
    });
  });

  describe("GET /api/auth/refresh-token", () => {
    test("200 - user refresh succesful ", async () => {
      const credentials = {
        email: "testemail@test.com",
        password: "Password123",
      };
      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(200);

      const loginTokens = response.body.tokens;

      const response2 = await request(app)
        .get("/api/auth/refresh-token")
        .set("Cookie", [`refresh_token=${loginTokens.refreshToken}`])
        .expect(200);
      expect(response2.body.tokens).toMatchObject({
        refreshToken: expect.any(String),
        accessToken: expect.any(String),
      });
    });
  });
});
