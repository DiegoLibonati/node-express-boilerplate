import express from "express";
import request from "supertest";

import type { Application, NextFunction, Request, RequestHandler, Response } from "express";
import type { Response as SupertestResponse } from "supertest";

describe("rate_limit.middleware", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach((): void => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  afterEach((): void => {
    process.env = originalEnv;
  });

  const loadRateLimiter = (): RequestHandler => {
    const mod = jest.requireActual<{ rateLimiter: RequestHandler }>(
      "@/middlewares/rate_limit.middleware"
    );
    return mod.rateLimiter;
  };

  const buildApp = (rateLimiter: RequestHandler): Application => {
    const app: Application = express();
    app.use(rateLimiter);
    app.get("/ping", (_req: Request, res: Response): void => {
      res.status(200).json({ ok: true });
    });
    return app;
  };

  describe("when RATE_LIMIT_MAX is 0", () => {
    it("should use a passthrough that calls next", () => {
      process.env.RATE_LIMIT_MAX = "0";

      const rateLimiter: RequestHandler = loadRateLimiter();
      const next: NextFunction = jest.fn();

      rateLimiter({} as Request, {} as Response, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });

    it("should allow many requests in a row without limiting", async () => {
      process.env.RATE_LIMIT_MAX = "0";
      const app: Application = buildApp(loadRateLimiter());

      for (let i = 0; i < 5; i++) {
        const response: SupertestResponse = await request(app).get("/ping");
        expect(response.status).toBe(200);
      }
    });
  });

  describe("when RATE_LIMIT_MAX is greater than 0", () => {
    it("should allow requests under the limit", async () => {
      process.env.RATE_LIMIT_MAX = "2";
      process.env.RATE_LIMIT_WINDOW_MS = "60000";
      const app: Application = buildApp(loadRateLimiter());

      const response: SupertestResponse = await request(app).get("/ping");

      expect(response.status).toBe(200);
    });

    it("should respond with 429 once the limit is exceeded", async () => {
      process.env.RATE_LIMIT_MAX = "2";
      process.env.RATE_LIMIT_WINDOW_MS = "60000";
      const app: Application = buildApp(loadRateLimiter());

      await request(app).get("/ping");
      await request(app).get("/ping");
      const blocked: SupertestResponse = await request(app).get("/ping");

      expect(blocked.status).toBe(429);
    });

    it("should set the RateLimit standard headers", async () => {
      process.env.RATE_LIMIT_MAX = "5";
      process.env.RATE_LIMIT_WINDOW_MS = "60000";
      const app: Application = buildApp(loadRateLimiter());

      const response: SupertestResponse = await request(app).get("/ping");

      expect(response.headers["ratelimit-limit"]).toBeDefined();
      expect(response.headers["ratelimit-remaining"]).toBeDefined();
    });

    it("should not set the legacy X-RateLimit headers", async () => {
      process.env.RATE_LIMIT_MAX = "5";
      process.env.RATE_LIMIT_WINDOW_MS = "60000";
      const app: Application = buildApp(loadRateLimiter());

      const response: SupertestResponse = await request(app).get("/ping");

      expect(response.headers["x-ratelimit-limit"]).toBeUndefined();
    });
  });
});
