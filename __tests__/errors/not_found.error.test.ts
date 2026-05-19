import { AppError } from "@/errors/app.error";
import { NotFoundError } from "@/errors/not_found.error";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

describe("not_found.error", () => {
  describe("NotFoundError", () => {
    it("should be an instance of Error", () => {
      const error: NotFoundError = new NotFoundError();

      expect(error).toBeInstanceOf(Error);
    });

    it("should be an instance of AppError", () => {
      const error: NotFoundError = new NotFoundError();

      expect(error).toBeInstanceOf(AppError);
    });

    it("should be an instance of NotFoundError", () => {
      const error: NotFoundError = new NotFoundError();

      expect(error).toBeInstanceOf(NotFoundError);
    });

    it("should always set status to 404", () => {
      const error: NotFoundError = new NotFoundError();

      expect(error.status).toBe(404);
    });

    it("should default code to CODES_NOT.foundNote", () => {
      const error: NotFoundError = new NotFoundError();

      expect(error.code).toBe(CODES_NOT.foundNote);
    });

    it("should default message to MESSAGES_NOT.foundNote", () => {
      const error: NotFoundError = new NotFoundError();

      expect(error.message).toBe(MESSAGES_NOT.foundNote);
    });

    it("should accept a custom code", () => {
      const error: NotFoundError = new NotFoundError("CUSTOM_CODE");

      expect(error.code).toBe("CUSTOM_CODE");
    });

    it("should accept a custom message", () => {
      const error: NotFoundError = new NotFoundError("CUSTOM_CODE", "Resource missing");

      expect(error.message).toBe("Resource missing");
    });

    it("should have name NotFoundError", () => {
      const error: NotFoundError = new NotFoundError();

      expect(error.name).toBe("NotFoundError");
    });
  });
});
