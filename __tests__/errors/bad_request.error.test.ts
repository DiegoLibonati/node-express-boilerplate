import { AppError } from "@/errors/app.error";
import { BadRequestError } from "@/errors/bad_request.error";

describe("bad_request.error", () => {
  describe("BadRequestError", () => {
    it("should be an instance of Error", () => {
      const error: BadRequestError = new BadRequestError("CODE", "Message");

      expect(error).toBeInstanceOf(Error);
    });

    it("should be an instance of AppError", () => {
      const error: BadRequestError = new BadRequestError("CODE", "Message");

      expect(error).toBeInstanceOf(AppError);
    });

    it("should be an instance of BadRequestError", () => {
      const error: BadRequestError = new BadRequestError("CODE", "Message");

      expect(error).toBeInstanceOf(BadRequestError);
    });

    it("should always set status to 400", () => {
      const error: BadRequestError = new BadRequestError("CODE", "Message");

      expect(error.status).toBe(400);
    });

    it("should expose the code passed to the constructor", () => {
      const error: BadRequestError = new BadRequestError("NOT_VALID_TITLE", "Title is required.");

      expect(error.code).toBe("NOT_VALID_TITLE");
    });

    it("should expose the message passed to the constructor", () => {
      const error: BadRequestError = new BadRequestError("NOT_VALID_TITLE", "Title is required.");

      expect(error.message).toBe("Title is required.");
    });

    it("should have name BadRequestError", () => {
      const error: BadRequestError = new BadRequestError("CODE", "Message");

      expect(error.name).toBe("BadRequestError");
    });
  });
});
