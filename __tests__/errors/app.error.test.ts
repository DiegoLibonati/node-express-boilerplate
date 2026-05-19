import { AppError } from "@/errors/app.error";

describe("app.error", () => {
  describe("AppError", () => {
    it("should be an instance of Error", () => {
      const error: AppError = new AppError(418, "TEAPOT", "I am a teapot");

      expect(error).toBeInstanceOf(Error);
    });

    it("should be an instance of AppError", () => {
      const error: AppError = new AppError(418, "TEAPOT", "I am a teapot");

      expect(error).toBeInstanceOf(AppError);
    });

    it("should expose the status passed to the constructor", () => {
      const error: AppError = new AppError(418, "TEAPOT", "I am a teapot");

      expect(error.status).toBe(418);
    });

    it("should expose the code passed to the constructor", () => {
      const error: AppError = new AppError(418, "TEAPOT", "I am a teapot");

      expect(error.code).toBe("TEAPOT");
    });

    it("should expose the message passed to the constructor", () => {
      const error: AppError = new AppError(418, "TEAPOT", "I am a teapot");

      expect(error.message).toBe("I am a teapot");
    });

    it("should set the name to AppError when instantiated directly", () => {
      const error: AppError = new AppError(500, "X", "Y");

      expect(error.name).toBe("AppError");
    });

    it("should set the name to the subclass name when extended", () => {
      class CustomError extends AppError {
        constructor() {
          super(400, "X", "Y");
        }
      }
      const error: CustomError = new CustomError();

      expect(error.name).toBe("CustomError");
    });

    it("should be catchable by instanceof", () => {
      try {
        throw new AppError(400, "X", "Y");
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
      }
    });
  });
});
