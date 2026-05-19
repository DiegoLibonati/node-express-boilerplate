import { CODES_ERROR, CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";

describe("codes.constant", () => {
  describe("CODES_SUCCESS", () => {
    it("should export all success codes with correct values", () => {
      expect(CODES_SUCCESS.getAllNotes).toBe("SUCCESS_GET_ALL_NOTES");
      expect(CODES_SUCCESS.getNote).toBe("SUCCESS_GET_NOTE");
      expect(CODES_SUCCESS.createNote).toBe("SUCCESS_CREATE_NOTE");
      expect(CODES_SUCCESS.updateNote).toBe("SUCCESS_UPDATE_NOTE");
      expect(CODES_SUCCESS.deleteNote).toBe("SUCCESS_DELETE_NOTE");
      expect(CODES_SUCCESS.healthLive).toBe("SUCCESS_HEALTH_LIVE");
      expect(CODES_SUCCESS.healthReady).toBe("SUCCESS_HEALTH_READY");
    });

    it("should not have duplicate values", () => {
      const values: string[] = Object.values(CODES_SUCCESS);
      const unique = new Set<string>(values);

      expect(unique.size).toBe(values.length);
    });
  });

  describe("CODES_NOT", () => {
    it("should export all not-found codes with correct values", () => {
      expect(CODES_NOT.foundRoute).toBe("NOT_FOUND_ROUTE");
      expect(CODES_NOT.foundNote).toBe("NOT_FOUND_NOTE");
      expect(CODES_NOT.validId).toBe("NOT_VALID_ID");
      expect(CODES_NOT.validTitle).toBe("NOT_VALID_TITLE");
      expect(CODES_NOT.validContent).toBe("NOT_VALID_CONTENT");
    });

    it("should not have duplicate values", () => {
      const values: string[] = Object.values(CODES_NOT);
      const unique = new Set<string>(values);

      expect(unique.size).toBe(values.length);
    });
  });

  describe("CODES_ERROR", () => {
    it("should export all error codes with correct values", () => {
      expect(CODES_ERROR.generic).toBe("ERROR_GENERIC");
    });
  });
});
