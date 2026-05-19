import type { NextFunction, Request, Response } from "express";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";

import { logger } from "@/configs/logger.config";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const { status, code, message } = getExceptionMessage(err);

  if (status >= 500) {
    logger.error({ err }, err.message);
  }

  res.status(status).json({ code, message });
};
