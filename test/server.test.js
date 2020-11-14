const { expect } = require("@jest/globals");
const request = require("supertest");
const server = require("../server");

describe("Server Test", () => {
  test("should return pong", (done) => {
    request(server)
      .get("/ping")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body.msg).toBe("pong");
        done();
      });
  });

  test("should return 404 with wrong endpoint", (done) => {
    request(server)
      .get("/asdsds")
      .expect("Content-Type", /json/)
      .expect(404)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body.msg).toBe("URL not found");
        done();
      });
  });
});
