const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../app");

test("GET /health returns ok true", async () => {
  const response = await request(app).get("/health");
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { ok: true });
});

test("GET /health allows the Vite dev origin", async () => {
  const response = await request(app)
    .get("/health")
    .set("Origin", "http://localhost:5173");
  assert.equal(response.status, 200);
  assert.equal(response.headers["access-control-allow-origin"], "http://localhost:5173");
});
