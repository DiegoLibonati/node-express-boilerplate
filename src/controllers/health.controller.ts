import type { NextFunction, Request, Response } from "express";

import { CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS } from "@/constants/messages.constant";

export const HealthController = {
  live: (_req: Request, res: Response, next: NextFunction): void => {
    try {
      res.status(200).json({
        code: CODES_SUCCESS.healthLive,
        message: MESSAGES_SUCCESS.healthLive,
        data: null,
      });
    } catch (e) {
      next(e);
    }
  },

  ready: (_req: Request, res: Response, next: NextFunction): void => {
    try {
      res.status(200).json({
        code: CODES_SUCCESS.healthReady,
        message: MESSAGES_SUCCESS.healthReady,
        data: null,
      });
    } catch (e) {
      next(e);
    }
  },
};
