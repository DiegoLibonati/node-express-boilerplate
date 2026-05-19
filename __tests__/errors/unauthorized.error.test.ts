import { AppError } from "@/errors/app.error";
import { UnauthorizedError } from "@/errors/unauthorized.error";

describe("unauthorized.error", () => {
  describe("UnauthorizedError", () => {
    it("should be an instance of Error", () => {
      const error: UnauthorizedError = new UnauthorizedError("CODE", "Message");

      expect(error).toBeInstanceOf(Error);
    });

    it("should be an instance of AppError", () => {
      const error: UnauthorizedError = new UnauthorizedError("CODE", "Message");

      expect(error).toBeInstanceOf(AppError);
    });

    it("should be an instance of UnauthorizedError", () => {
      const error: UnauthorizedError = new UnauthorizedError("CODE", "Message");

      expect(error).toBeInstanceOf(UnauthorizedError);
    });

    it("should always set status to 401", () => {
      const error: UnauthorizedError = new UnauthorizedError("CODE", "Message");

      expect(error.status).toBe(401);
    });

    it("should expose the code passed to the constructor", () => {
      const error: UnauthorizedError = new UnauthorizedError("INVALID_TOKEN", "Invalid token.");

      expect(error.code).toBe("INVALID_TOKEN");
    });

    it("should expose the message passed to the constructor", () => {
      const error: UnauthorizedError = new UnauthorizedError("INVALID_TOKEN", "Invalid token.");

      expect(error.message).toBe("Invalid token.");
    });

    it("should have name UnauthorizedError", () => {
      const error: UnauthorizedError = new UnauthorizedError("CODE", "Message");

      expect(error.name).toBe("UnauthorizedError");
    });
  });
});
