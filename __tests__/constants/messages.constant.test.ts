import { MESSAGES_ERROR, MESSAGES_NOT, MESSAGES_SUCCESS } from "@/constants/messages.constant";

describe("messages.constant", () => {
  describe("MESSAGES_SUCCESS", () => {
    it("should export all success messages with correct values", () => {
      expect(MESSAGES_SUCCESS.getAllNotes).toBe("Notes successfully retrieved.");
      expect(MESSAGES_SUCCESS.getNote).toBe("Note successfully retrieved.");
      expect(MESSAGES_SUCCESS.createNote).toBe("Note successfully created.");
      expect(MESSAGES_SUCCESS.updateNote).toBe("Note successfully updated.");
      expect(MESSAGES_SUCCESS.deleteNote).toBe("Note successfully deleted.");
      expect(MESSAGES_SUCCESS.healthLive).toBe("Service is alive.");
      expect(MESSAGES_SUCCESS.healthReady).toBe("Service is ready.");
    });
  });

  describe("MESSAGES_NOT", () => {
    it("should export all not-found messages with correct values", () => {
      expect(MESSAGES_NOT.foundRoute).toBe("Route not found.");
      expect(MESSAGES_NOT.foundNote).toBe("Note not found.");
      expect(MESSAGES_NOT.validId).toBe("A valid note ID is required.");
      expect(MESSAGES_NOT.validTitle).toBe("Title is required.");
      expect(MESSAGES_NOT.validContent).toBe("Content is required.");
    });
  });

  describe("MESSAGES_ERROR", () => {
    it("should export all error messages with correct values", () => {
      expect(MESSAGES_ERROR.generic).toBe("Something went wrong.");
    });
  });
});
