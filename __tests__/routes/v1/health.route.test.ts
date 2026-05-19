import request from "supertest";

import type { Response } from "supertest";

import app from "@/app";

import { CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS } from "@/constants/messages.constant";

describe("health.route", () => {
  describe("GET /api/v1/health/live", () => {
    it("should return 200 with the health live payload", async () => {
      const response: Response = await request(app).get("/api/v1/health/live");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        code: CODES_SUCCESS.healthLive,
        message: MESSAGES_SUCCESS.healthLive,
        data: null,
      });
    });

    it("should return a JSON content type", async () => {
      const response: Response = await request(app).get("/api/v1/health/live");

      expect(response.headers["content-type"]).toMatch(/application\/json/);
    });
  });

  describe("GET /api/v1/health/ready", () => {
    it("should return 200 with the health ready payload", async () => {
      const response: Response = await request(app).get("/api/v1/health/ready");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        code: CODES_SUCCESS.healthReady,
        message: MESSAGES_SUCCESS.healthReady,
        data: null,
      });
    });

    it("should return a JSON content type", async () => {
      const response: Response = await request(app).get("/api/v1/health/ready");

      expect(response.headers["content-type"]).toMatch(/application\/json/);
    });
  });

  describe("Unsupported method", () => {
    it("should return 404 for POST on /api/v1/health/live", async () => {
      const response: Response = await request(app).post("/api/v1/health/live");

      expect(response.status).toBe(404);
    });
  });
});
