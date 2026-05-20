import type { MessagesError, MessagesNot, MessagesSuccess } from "@/types/constants";

export const MESSAGES_SUCCESS: MessagesSuccess = {
  getAllNotes: "Notes successfully retrieved.",
  getNote: "Note successfully retrieved.",
  createNote: "Note successfully created.",
  updateNote: "Note successfully updated.",
  deleteNote: "Note successfully deleted.",
  healthLive: "Service is alive.",
  healthReady: "Service is ready.",
};

export const MESSAGES_NOT: MessagesNot = {
  foundRoute: "Route not found.",
  foundNote: "Note not found.",
  validId: "A valid note ID is required.",
  validTitle: "Title is required.",
  validContent: "Content is required.",
};

export const MESSAGES_ERROR: MessagesError = {
  generic: "Something went wrong.",
  validation: "Validation failed.",
};
