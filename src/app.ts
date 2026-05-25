import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";

import type { RequestHandler } from "express";

import routes from "@/routes";

import { errorHandler } from "@/middlewares/error_handler.middleware";
import { notFoundHandler } from "@/middlewares/not_found_handler.middleware";
import { rateLimiter } from "@/middlewares/rate_limit.middleware";
import { requestId } from "@/middlewares/request_id.middleware";

import { envs } from "@/configs/env.config";
import { logger } from "@/configs/logger.config";

const app: express.Application = express();

app.disable("x-powered-by");

app.use(requestId);
app.use(rateLimiter);
app.use(helmet() as RequestHandler);
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => (req as express.Request).id,
  }) as unknown as RequestHandler
);
app.use(express.json({ limit: envs.BODY_LIMIT }));
app.use(express.urlencoded({ extended: false, limit: envs.BODY_LIMIT }));

app.use("/api/v1", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
