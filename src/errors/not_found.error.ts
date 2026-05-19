import { AppError } from "@/errors/app.error";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

export class NotFoundError extends AppError {
  constructor(code: string = CODES_NOT.foundNote, message: string = MESSAGES_NOT.foundNote) {
    super(404, code, message);
  }
}
