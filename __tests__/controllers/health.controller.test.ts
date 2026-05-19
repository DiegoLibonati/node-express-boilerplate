import type { NextFunction, Request, Response } from "express";

import { HealthController } from "@/controllers/health.controller";

import { CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS } from "@/constants/messages.constant";

const buildReq = (): Request => ({}) as Request;

const buildRes = (): Response => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return mockRes as unknown as Response;
};

describe("health.controller", () => {
  describe("live", () => {
    it("should return 200 with health live payload", () => {
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      HealthController.live(buildReq(), res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.healthLive,
        message: MESSAGES_SUCCESS.healthLive,
        data: null,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next when res.status throws", () => {
      const error: Error = new Error("boom");
      const res: Response = {
        status: jest.fn(() => {
          throw error;
        }),
      } as unknown as Response;
      const next: NextFunction = jest.fn();

      HealthController.live(buildReq(), res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("ready", () => {
    it("should return 200 with health ready payload", () => {
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      HealthController.ready(buildReq(), res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.healthReady,
        message: MESSAGES_SUCCESS.healthReady,
        data: null,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next when res.status throws", () => {
      const error: Error = new Error("boom");
      const res: Response = {
        status: jest.fn(() => {
          throw error;
        }),
      } as unknown as Response;
      const next: NextFunction = jest.fn();

      HealthController.ready(buildReq(), res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
