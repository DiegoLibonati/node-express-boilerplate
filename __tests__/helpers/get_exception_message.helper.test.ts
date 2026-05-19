import type { ExceptionInfo } from "@/types/helpers";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";

import { AppError } from "@/errors/app.error";
import { BadRequestError } from "@/errors/bad_request.error";
import { ConflictError } from "@/errors/conflict.error";
import { NotFoundError } from "@/errors/not_found.error";
import { UnauthorizedError } from "@/errors/unauthorized.error";

import { CODES_ERROR, CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_ERROR, MESSAGES_NOT } from "@/constants/messages.constant";

describe("get_exception_message.helper", () => {
  describe("getExceptionMessage", () => {
    it("should return the AppError status, code and message when error is an AppError", () => {
      const error: AppError = new AppError(418, "TEAPOT", "I am a teapot");

      const result: ExceptionInfo = getExceptionMessage(error);

      expect(result).toEqual({ status: 418, code: "TEAPOT", message: "I am a teapot" });
    });

    it("should return 404 with not found info when error is a default NotFoundError", () => {
      const result: ExceptionInfo = getExceptionMessage(new NotFoundError());

      expect(result).toEqual({
        status: 404,
        code: CODES_NOT.foundNote,
        message: MESSAGES_NOT.foundNote,
      });
    });

    it("should return 400 status when error is a BadRequestError", () => {
      const result: ExceptionInfo = getExceptionMessage(
        new BadRequestError("NOT_VALID_TITLE", "Title is required.")
      );

      expect(result).toEqual({
        status: 400,
        code: "NOT_VALID_TITLE",
        message: "Title is required.",
      });
    });

    it("should return 401 status when error is an UnauthorizedError", () => {
      const result: ExceptionInfo = getExceptionMessage(
        new UnauthorizedError("INVALID_TOKEN", "Invalid token")
      );

      expect(result.status).toBe(401);
      expect(result.code).toBe("INVALID_TOKEN");
    });

    it("should return 409 status when error is a ConflictError", () => {
      const result: ExceptionInfo = getExceptionMessage(
        new ConflictError("DUPLICATE", "Already exists")
      );

      expect(result.status).toBe(409);
      expect(result.code).toBe("DUPLICATE");
    });

    it("should return 500 with generic info when error is a generic Error", () => {
      const result: ExceptionInfo = getExceptionMessage(new Error("unexpected"));

      expect(result).toEqual({
        status: 500,
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });

    it("should return 500 with generic info when error is a string", () => {
      const result: ExceptionInfo = getExceptionMessage("some string error");

      expect(result).toEqual({
        status: 500,
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });

    it("should return 500 with generic info when error is null", () => {
      const result: ExceptionInfo = getExceptionMessage(null);

      expect(result).toEqual({
        status: 500,
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });

    it("should return 500 with generic info when error is undefined", () => {
      const result: ExceptionInfo = getExceptionMessage(undefined);

      expect(result).toEqual({
        status: 500,
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });
  });
});
