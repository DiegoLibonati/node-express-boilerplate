import type { ExceptionInfo } from "@/types/helpers";

import { AppError } from "@/errors/app.error";

import { CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_ERROR } from "@/constants/messages.constant";

export const getExceptionMessage = (e: unknown): ExceptionInfo => {
  if (e instanceof AppError) {
    return { status: e.status, code: e.code, message: e.message };
  }

  return { status: 500, code: CODES_ERROR.generic, message: MESSAGES_ERROR.generic };
};
