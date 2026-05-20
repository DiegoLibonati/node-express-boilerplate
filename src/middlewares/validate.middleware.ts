import { ZodError } from "zod";

import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ValidateConfig } from "@/types/app";

import { CODES_ERROR, CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_ERROR, MESSAGES_NOT } from "@/constants/messages.constant";

import { BadRequestError } from "@/errors/bad_request.error";

const FIELD_TO_ERROR: Record<string, { code: string; message: string }> = {
  id: { code: CODES_NOT.validId, message: MESSAGES_NOT.validId },
  title: { code: CODES_NOT.validTitle, message: MESSAGES_NOT.validTitle },
  content: { code: CODES_NOT.validContent, message: MESSAGES_NOT.validContent },
};

const toBadRequest = (err: ZodError): BadRequestError => {
  const issue = err.issues[0];
  const field = issue?.path[0];
  const fieldKey = typeof field === "string" ? field : "";
  const mapped = FIELD_TO_ERROR[fieldKey];
  const code = mapped?.code ?? CODES_ERROR.validation;
  const message = mapped?.message ?? issue?.message ?? MESSAGES_ERROR.validation;
  return new BadRequestError(code, message);
};

export const validate = (schemas: ValidateConfig): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.params) {
        const parsed: unknown = schemas.params.parse(req.params);
        req.params = parsed as typeof req.params;
      }
      if (schemas.query) {
        schemas.query.parse(req.query);
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        next(toBadRequest(e));
        return;
      }
      next(e);
    }
  };
};
