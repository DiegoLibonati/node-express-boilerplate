import rateLimit from "express-rate-limit";

import type { NextFunction, Request, RequestHandler, Response } from "express";

import { envs } from "@/configs/env.config";

const passthrough: RequestHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next();
};

export const rateLimiter: RequestHandler =
  envs.RATE_LIMIT_MAX > 0
    ? rateLimit({
        windowMs: envs.RATE_LIMIT_WINDOW_MS,
        max: envs.RATE_LIMIT_MAX,
        standardHeaders: true,
        legacyHeaders: false,
      })
    : passthrough;
