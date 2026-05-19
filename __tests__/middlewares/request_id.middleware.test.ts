import type { NextFunction, Request, Response } from "express";

import { requestId } from "@/middlewares/request_id.middleware";

const buildReq = (header?: string): Request => {
  const headers: Record<string, string> = header !== undefined ? { "x-request-id": header } : {};
  return {
    header: jest.fn((name: string): string | undefined => headers[name.toLowerCase()]),
  } as unknown as Request;
};

const buildRes = (): Response => {
  return {
    setHeader: jest.fn(),
  } as unknown as Response;
};

describe("request_id.middleware", () => {
  describe("requestId", () => {
    it("should generate a UUID when no x-request-id header is present", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      requestId(req, res, next);

      expect(req.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it("should use the incoming x-request-id header when present", () => {
      const req: Request = buildReq("incoming-id-123");
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      requestId(req, res, next);

      expect(req.id).toBe("incoming-id-123");
    });

    it("should generate a UUID when incoming header is an empty string", () => {
      const req: Request = buildReq("");
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      requestId(req, res, next);

      expect(req.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it("should set the x-request-id response header to the same id assigned to req.id", () => {
      const req: Request = buildReq("incoming-id-123");
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      requestId(req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith("x-request-id", "incoming-id-123");
    });

    it("should call next once", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      requestId(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it("should generate a different UUID for each call when no header is provided", () => {
      const req1: Request = buildReq();
      const req2: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      requestId(req1, res, next);
      requestId(req2, res, next);

      expect(req1.id).not.toBe(req2.id);
    });
  });
});
