import { z } from "zod";

import type { NextFunction, Request, Response } from "express";

import { validate } from "@/middlewares/validate.middleware";

import { BadRequestError } from "@/errors/bad_request.error";

import { CODES_ERROR, CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

const buildReq = (overrides: Partial<Request> = {}): Request => {
  return {
    params: {},
    query: {},
    body: {},
    ...overrides,
  } as Request;
};

const buildRes = (): Response => ({}) as Response;

describe("validate.middleware", () => {
  describe("validate", () => {
    it("should call next without arguments when params are valid", () => {
      const schemas = { params: z.object({ id: z.string().regex(/^[1-9]\d*$/) }) };
      const req: Request = buildReq({ params: { id: "1" } });
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      validate(schemas)(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });

    it("should replace req.params with the parsed result", () => {
      const schemas = { params: z.object({ id: z.string() }) };
      const req: Request = buildReq({
        params: { id: "1", extra: "x" } as unknown as Request["params"],
      });
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      validate(schemas)(req, res, next);

      expect(req.params).toEqual({ id: "1" });
    });

    it("should replace req.body with the parsed (and trimmed) result", () => {
      const schemas = { body: z.object({ title: z.string().trim() }) };
      const req: Request = buildReq({ body: { title: "  Title  " } });
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      validate(schemas)(req, res, next);

      expect(req.body).toEqual({ title: "Title" });
    });

    it("should pass query through parse without replacing req.query", () => {
      const schemas = { query: z.object({ q: z.string() }) };
      const req: Request = buildReq({ query: { q: "search" } as unknown as Request["query"] });
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      validate(schemas)(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it("should call next with BadRequestError using NOT_VALID_ID code when id fails", () => {
      const schemas = { params: z.object({ id: z.string().regex(/^[1-9]\d*$/) }) };
      const req: Request = buildReq({ params: { id: "abc" } });
      const res: Response = buildRes();
      const next: jest.Mock = jest.fn();

      validate(schemas)(req, res, next);

      const error = next.mock.calls[0]?.[0] as BadRequestError;
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.code).toBe(CODES_NOT.validId);
      expect(error.message).toBe(MESSAGES_NOT.validId);
    });

    it("should call next with BadRequestError using NOT_VALID_TITLE code when title fails", () => {
      const schemas = { body: z.object({ title: z.string().trim().min(1) }) };
      const req: Request = buildReq({ body: { title: "" } });
      const res: Response = buildRes();
      const next: jest.Mock = jest.fn();

      validate(schemas)(req, res, next);

      const error = next.mock.calls[0]?.[0] as BadRequestError;
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.code).toBe(CODES_NOT.validTitle);
      expect(error.message).toBe(MESSAGES_NOT.validTitle);
    });

    it("should call next with BadRequestError using NOT_VALID_CONTENT code when content fails", () => {
      const schemas = { body: z.object({ content: z.string().trim().min(1) }) };
      const req: Request = buildReq({ body: { content: "" } });
      const res: Response = buildRes();
      const next: jest.Mock = jest.fn();

      validate(schemas)(req, res, next);

      const error = next.mock.calls[0]?.[0] as BadRequestError;
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.code).toBe(CODES_NOT.validContent);
    });

    it("should fall back to ERROR_VALIDATION code when the field is not mapped", () => {
      const schemas = { body: z.object({ unknownField: z.string() }) };
      const req: Request = buildReq({ body: { unknownField: 123 } });
      const res: Response = buildRes();
      const next: jest.Mock = jest.fn();

      validate(schemas)(req, res, next);

      const error = next.mock.calls[0]?.[0] as BadRequestError;
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.code).toBe(CODES_ERROR.validation);
    });

    it("should pass through unknown (non-Zod) errors to next without wrapping", () => {
      const customError: Error = new Error("custom");
      const throwingSchema = {
        parse: jest.fn(() => {
          throw customError;
        }),
      } as unknown as z.ZodType;
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: jest.Mock = jest.fn();

      validate({ body: throwingSchema })(req, res, next);

      expect(next).toHaveBeenCalledWith(customError);
    });

    it("should only validate the schemas provided", () => {
      const paramsSpy = jest.fn();
      const schemas = {
        body: z.object({ title: z.string() }),
      };
      const req: Request = buildReq({ body: { title: "T" }, params: { id: "x" } });
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      validate(schemas)(req, res, next);

      expect(paramsSpy).not.toHaveBeenCalled();
      expect(req.params).toEqual({ id: "x" });
    });

    it("should call next with no arguments when no schemas are provided", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      validate({})(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
