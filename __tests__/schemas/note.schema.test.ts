import {
  noteCreateBodySchema,
  noteIdParamsSchema,
  noteUpdateBodySchema,
} from "@/schemas/note.schema";

describe("note.schema", () => {
  describe("noteIdParamsSchema", () => {
    it("should accept a positive integer id as a string", () => {
      const result = noteIdParamsSchema.safeParse({ id: "1" });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe("1");
      }
    });

    it("should accept a large positive integer id as a string", () => {
      const result = noteIdParamsSchema.safeParse({ id: "12345" });

      expect(result.success).toBe(true);
    });

    it("should reject zero", () => {
      const result = noteIdParamsSchema.safeParse({ id: "0" });

      expect(result.success).toBe(false);
    });

    it("should reject negative integers", () => {
      const result = noteIdParamsSchema.safeParse({ id: "-1" });

      expect(result.success).toBe(false);
    });

    it("should reject non-numeric strings", () => {
      const result = noteIdParamsSchema.safeParse({ id: "abc" });

      expect(result.success).toBe(false);
    });

    it("should reject decimal numbers", () => {
      const result = noteIdParamsSchema.safeParse({ id: "1.5" });

      expect(result.success).toBe(false);
    });

    it("should reject ids with leading zeros", () => {
      const result = noteIdParamsSchema.safeParse({ id: "01" });

      expect(result.success).toBe(false);
    });

    it("should reject an empty string", () => {
      const result = noteIdParamsSchema.safeParse({ id: "" });

      expect(result.success).toBe(false);
    });

    it("should report the path 'id' on the first issue when invalid", () => {
      const result = noteIdParamsSchema.safeParse({ id: "abc" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("id");
      }
    });
  });

  describe("noteCreateBodySchema", () => {
    it("should accept a valid title and content", () => {
      const result = noteCreateBodySchema.safeParse({ title: "Title", content: "Content" });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ title: "Title", content: "Content" });
      }
    });

    it("should trim the title", () => {
      const result = noteCreateBodySchema.safeParse({ title: "  Title  ", content: "Content" });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Title");
      }
    });

    it("should trim the content", () => {
      const result = noteCreateBodySchema.safeParse({ title: "Title", content: "  Content  " });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.content).toBe("Content");
      }
    });

    it("should reject when title is missing", () => {
      const result = noteCreateBodySchema.safeParse({ content: "Content" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("title");
      }
    });

    it("should reject when title is blank after trim", () => {
      const result = noteCreateBodySchema.safeParse({ title: "   ", content: "Content" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("title");
      }
    });

    it("should reject when content is missing", () => {
      const result = noteCreateBodySchema.safeParse({ title: "Title" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("content");
      }
    });

    it("should reject when content is blank after trim", () => {
      const result = noteCreateBodySchema.safeParse({ title: "Title", content: "   " });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("content");
      }
    });

    it("should reject when title is not a string", () => {
      const result = noteCreateBodySchema.safeParse({ title: 123, content: "Content" });

      expect(result.success).toBe(false);
    });
  });

  describe("noteUpdateBodySchema", () => {
    it("should accept a title only", () => {
      const result = noteUpdateBodySchema.safeParse({ title: "Title" });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ title: "Title" });
      }
    });

    it("should accept a content only", () => {
      const result = noteUpdateBodySchema.safeParse({ content: "Content" });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ content: "Content" });
      }
    });

    it("should accept both title and content", () => {
      const result = noteUpdateBodySchema.safeParse({ title: "Title", content: "Content" });

      expect(result.success).toBe(true);
    });

    it("should trim the title", () => {
      const result = noteUpdateBodySchema.safeParse({ title: "  Title  " });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Title");
      }
    });

    it("should trim the content", () => {
      const result = noteUpdateBodySchema.safeParse({ content: "  Content  " });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.content).toBe("Content");
      }
    });

    it("should reject an empty object", () => {
      const result = noteUpdateBodySchema.safeParse({});

      expect(result.success).toBe(false);
    });

    it("should reject when title is blank after trim", () => {
      const result = noteUpdateBodySchema.safeParse({ title: "   " });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("title");
      }
    });

    it("should reject when content is blank after trim", () => {
      const result = noteUpdateBodySchema.safeParse({ content: "   " });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("content");
      }
    });
  });
});
