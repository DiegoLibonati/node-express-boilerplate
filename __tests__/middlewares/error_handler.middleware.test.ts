import type { NextFunction, Request, Response } from "express";

import { errorHandler } from "@/middlewares/error_handler.middleware";

import { AppError } from "@/errors/app.error";
import { BadRequestError } from "@/errors/bad_request.error";
import { NotFoundError } from "@/errors/not_found.error";

import { CODES_ERROR, CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_ERROR, MESSAGES_NOT } from "@/constants/messages.constant";

import { logger } from "@/configs/logger.config";

const mockedLogger = logger as unknown as { error: jest.Mock };

jest.mock("@/configs/logger.config", () => ({
  logger: { error: jest.fn() },
}));

const buildRes = (): Response => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return mockRes as unknown as Response;
};

describe("error_handler.middleware", () => {
  describe("errorHandler", () => {
    it("should return 500 with generic info when error is a generic Error", () => {
      const err: Error = new Error("unexpected");
      const req: Request = {} as Request;
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });

    it("should log the error when status is 500 or higher", () => {
      const err: Error = new Error("boom");
      const req: Request = {} as Request;
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      errorHandler(err, req, res, next);

      expect(mockedLogger.error).toHaveBeenCalledTimes(1);
      expect(mockedLogger.error).toHaveBeenCalledWith({ err }, "boom");
    });

    it("should return 404 with NotFoundError info when error is NotFoundError", () => {
      const err: NotFoundError = new NotFoundError();
      const req: Request = {} as Request;
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.foundNote,
        message: MESSAGES_NOT.foundNote,
      });
    });

    it("should return 400 with BadRequestError info when error is BadRequestError", () => {
      const err: BadRequestError = new BadRequestError("NOT_VALID_TITLE", "Title is required.");
      const req: Request = {} as Request;
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: "NOT_VALID_TITLE",
        message: "Title is required.",
      });
    });

    it("should not call logger.error when status is below 500", () => {
      const err: BadRequestError = new BadRequestError("X", "Y");
      const req: Request = {} as Request;
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      errorHandler(err, req, res, next);

      expect(mockedLogger.error).not.toHaveBeenCalled();
    });

    it("should log the error when AppError status is 500 or higher", () => {
      const err: AppError = new AppError(503, "UNAVAILABLE", "Service unavailable");
      const req: Request = {} as Request;
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      errorHandler(err, req, res, next);

      expect(mockedLogger.error).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(503);
    });

    it("should never call next", () => {
      const err: Error = new Error("Error");
      const req: Request = {} as Request;
      const res: Response = buildRes();
      const next: jest.Mock = jest.fn();

      errorHandler(err, req, res, next);

      expect(next).not.toHaveBeenCalled();
    });
  });
});
