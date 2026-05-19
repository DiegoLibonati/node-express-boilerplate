import type { CodesError, CodesNot, CodesSuccess } from "@/types/constants";

export const CODES_SUCCESS: CodesSuccess = {
  getAllNotes: "SUCCESS_GET_ALL_NOTES",
  getNote: "SUCCESS_GET_NOTE",
  createNote: "SUCCESS_CREATE_NOTE",
  updateNote: "SUCCESS_UPDATE_NOTE",
  deleteNote: "SUCCESS_DELETE_NOTE",
  healthLive: "SUCCESS_HEALTH_LIVE",
  healthReady: "SUCCESS_HEALTH_READY",
};

export const CODES_NOT: CodesNot = {
  foundRoute: "NOT_FOUND_ROUTE",
  foundNote: "NOT_FOUND_NOTE",
  validId: "NOT_VALID_ID",
  validTitle: "NOT_VALID_TITLE",
  validContent: "NOT_VALID_CONTENT",
};

export const CODES_ERROR: CodesError = {
  generic: "ERROR_GENERIC",
};
