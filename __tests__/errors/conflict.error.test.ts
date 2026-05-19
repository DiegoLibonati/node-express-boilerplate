import { AppError } from "@/errors/app.error";
import { ConflictError } from "@/errors/conflict.error";

describe("conflict.error", () => {
  describe("ConflictError", () => {
    it("should be an instance of Error", () => {
      const error: ConflictError = new ConflictError("CODE", "Message");

      expect(error).toBeInstanceOf(Error);
    });

    it("should be an instance of AppError", () => {
      const error: ConflictError = new ConflictError("CODE", "Message");

      expect(error).toBeInstanceOf(AppError);
    });

    it("should be an instance of ConflictError", () => {
      const error: ConflictError = new ConflictError("CODE", "Message");

      expect(error).toBeInstanceOf(ConflictError);
    });

    it("should always set status to 409", () => {
      const error: ConflictError = new ConflictError("CODE", "Message");

      expect(error.status).toBe(409);
    });

    it("should expose the code passed to the constructor", () => {
      const error: ConflictError = new ConflictError("DUPLICATE_RESOURCE", "Already exists.");

      expect(error.code).toBe("DUPLICATE_RESOURCE");
    });

    it("should expose the message passed to the constructor", () => {
      const error: ConflictError = new ConflictError("DUPLICATE_RESOURCE", "Already exists.");

      expect(error.message).toBe("Already exists.");
    });

    it("should have name ConflictError", () => {
      const error: ConflictError = new ConflictError("CODE", "Message");

      expect(error.name).toBe("ConflictError");
    });
  });
});
