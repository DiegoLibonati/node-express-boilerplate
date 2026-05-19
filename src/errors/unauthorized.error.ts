import { AppError } from "@/errors/app.error";

export class UnauthorizedError extends AppError {
  constructor(code: string, message: string) {
    super(401, code, message);
  }
}
