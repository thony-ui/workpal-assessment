// test/student-management.test.ts
import request from "supertest";
import { app, server } from "../../../app";

describe("Student Management API", () => {
  describe("GET /api/commonstudents", () => {
    it("should return 200 and list of common students for valid teachers", async () => {
      const res = await request(app)
        .get("/api/commonstudents")
        .query({ teacher: ["teacherken@gmail.com", "teacherjoe@gmail.com"] })
        .set("Accept", "application/json");

      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/application\/json/);
      expect(res.body).toHaveProperty("students");
      expect(Array.isArray(res.body.students)).toBe(true);
    });

    it("should return 400 if teacher query is missing", async () => {
      const res = await request(app)
        .get("/api/commonstudents")
        .set("Accept", "application/json");

      expect(res.status).toBe(400);
      expect(res.headers["content-type"]).toMatch(/application\/json/);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("POST /api/retrievefornotifications", () => {
    it("should return 200 and list of recipients for valid input", async () => {
      const payload = {
        teacher: "teacherken@gmail.com",
        notification:
          "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com",
      };

      const res = await request(app)
        .post("/api/retrievefornotifications")
        .send(payload)
        .set("Accept", "application/json");

      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/application\/json/);
      expect(res.body).toHaveProperty("recipients");
      expect(Array.isArray(res.body.recipients)).toBe(true);
    });

    it("should return 400 if request body is missing", async () => {
      const res = await request(app)
        .post("/api/retrievefornotifications")
        .send({})
        .set("Accept", "application/json");

      expect(res.status).toBe(400);
      expect(res.headers["content-type"]).toMatch(/application\/json/);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("POST /api/register", () => {
    it("should return 204 on successful registration", async () => {
      const payload = {
        teacher: "teacherken@gmail.com",
        students: ["studentagnes@gmail.com", "studentbob@gmail.com"],
      };

      const res = await request(app)
        .post("/api/register")
        .send(payload)
        .set("Accept", "application/json");

      expect(res.status).toBe(204);
    });

    it("should return 400 for invalid request body", async () => {
      const res = await request(app)
        .post("/api/register")
        .send({ teacher: "invalid-email", students: "not-an-array" })
        .set("Accept", "application/json");

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });
  });
  afterAll((done) => {
    server.close(done);
  });
});
