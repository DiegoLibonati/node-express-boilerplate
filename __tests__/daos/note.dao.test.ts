import type { Note } from "@/types/models";
import type { NoteCreateBody, NoteUpdateBody } from "@/types/zod";

import { NoteDAO } from "@/daos/note.dao";

import { NotFoundError } from "@/errors/not_found.error";

describe("note.dao", () => {
  describe("findMany", () => {
    it("should return an empty array when store is empty", () => {
      const result: Note[] = NoteDAO.findMany();

      expect(result).toEqual([]);
    });

    it("should return notes sorted by createdAt descending", () => {
      jest.useFakeTimers();
      const note1: Note = NoteDAO.create({ title: "First", content: "Content 1" });
      jest.advanceTimersByTime(1000);
      const note2: Note = NoteDAO.create({ title: "Second", content: "Content 2" });
      jest.useRealTimers();

      const result: Note[] = NoteDAO.findMany();

      expect(result).toHaveLength(2);
      expect(result[0]?.id).toBe(note2.id);
      expect(result[1]?.id).toBe(note1.id);
    });

    it("should return a new array and not the original reference", () => {
      NoteDAO.create({ title: "Test", content: "Content" });

      const result1: Note[] = NoteDAO.findMany();
      const result2: Note[] = NoteDAO.findMany();

      expect(result1).not.toBe(result2);
    });
  });

  describe("findById", () => {
    it("should return null when note does not exist", () => {
      const result: Note | null = NoteDAO.findById(999);

      expect(result).toBeNull();
    });

    it("should return the note when it exists", () => {
      const created: Note = NoteDAO.create({ title: "Test", content: "Content" });

      const result: Note | null = NoteDAO.findById(created.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.title).toBe("Test");
    });
  });

  describe("create", () => {
    it("should create a note with the provided title and content", () => {
      const payload: NoteCreateBody = { title: "My Note", content: "My Content" };

      const result: Note = NoteDAO.create(payload);

      expect(result.title).toBe("My Note");
      expect(result.content).toBe("My Content");
    });

    it("should assign an id starting from 1", () => {
      const result: Note = NoteDAO.create({ title: "Note", content: "Content" });

      expect(result.id).toBe(1);
    });

    it("should auto-increment the id for each created note", () => {
      const note1: Note = NoteDAO.create({ title: "Note 1", content: "Content" });
      const note2: Note = NoteDAO.create({ title: "Note 2", content: "Content" });
      const note3: Note = NoteDAO.create({ title: "Note 3", content: "Content" });

      expect(note1.id).toBe(1);
      expect(note2.id).toBe(2);
      expect(note3.id).toBe(3);
    });

    it("should set createdAt and updatedAt to the same value on creation", () => {
      const result: Note = NoteDAO.create({ title: "Note", content: "Content" });

      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt.getTime()).toBe(result.updatedAt.getTime());
    });

    it("should persist the note so findById returns it", () => {
      const created: Note = NoteDAO.create({ title: "Persisted", content: "Body" });

      expect(NoteDAO.findById(created.id)).toEqual(created);
    });
  });

  describe("updateById", () => {
    it("should throw NotFoundError when note does not exist", () => {
      const payload: NoteUpdateBody = { title: "Updated" };

      expect(() => NoteDAO.updateById(999, payload)).toThrow(NotFoundError);
    });

    it("should update the title and return the updated note", () => {
      const created: Note = NoteDAO.create({ title: "Original", content: "Content" });
      const payload: NoteUpdateBody = { title: "Updated Title" };

      const result: Note = NoteDAO.updateById(created.id, payload);

      expect(result.id).toBe(created.id);
      expect(result.title).toBe("Updated Title");
      expect(result.content).toBe("Content");
    });

    it("should update the content and return the updated note", () => {
      const created: Note = NoteDAO.create({ title: "Title", content: "Original content" });

      const result: Note = NoteDAO.updateById(created.id, { content: "New content" });

      expect(result.id).toBe(created.id);
      expect(result.title).toBe("Title");
      expect(result.content).toBe("New content");
    });

    it("should update both fields at once", () => {
      const created: Note = NoteDAO.create({ title: "Old", content: "Old" });

      const result: Note = NoteDAO.updateById(created.id, { title: "New", content: "New" });

      expect(result.title).toBe("New");
      expect(result.content).toBe("New");
    });

    it("should leave the title unchanged when only content is provided", () => {
      const created: Note = NoteDAO.create({ title: "Keep", content: "Old" });

      const result: Note = NoteDAO.updateById(created.id, { content: "New" });

      expect(result.title).toBe("Keep");
    });

    it("should update updatedAt while preserving createdAt", () => {
      jest.useFakeTimers();
      const created: Note = NoteDAO.create({ title: "Note", content: "Content" });
      jest.advanceTimersByTime(1000);

      const result: Note = NoteDAO.updateById(created.id, { title: "Updated" });
      jest.useRealTimers();

      expect(result.createdAt.getTime()).toBe(created.createdAt.getTime());
      expect(result.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
    });

    it("should persist the changes so findById returns the updated note", () => {
      const created: Note = NoteDAO.create({ title: "Original", content: "Content" });

      NoteDAO.updateById(created.id, { title: "Updated" });

      expect(NoteDAO.findById(created.id)?.title).toBe("Updated");
    });
  });

  describe("deleteById", () => {
    it("should throw NotFoundError when note does not exist", () => {
      expect(() => NoteDAO.deleteById(999)).toThrow(NotFoundError);
    });

    it("should delete and return the deleted note", () => {
      const created: Note = NoteDAO.create({ title: "To delete", content: "Content" });

      const result: Note = NoteDAO.deleteById(created.id);

      expect(result.id).toBe(created.id);
      expect(result.title).toBe("To delete");
    });

    it("should remove the note from the store", () => {
      const created: Note = NoteDAO.create({ title: "To delete", content: "Content" });

      NoteDAO.deleteById(created.id);

      expect(NoteDAO.findById(created.id)).toBeNull();
    });

    it("should not affect other notes", () => {
      const keep: Note = NoteDAO.create({ title: "Keep", content: "Stay" });
      const remove: Note = NoteDAO.create({ title: "Remove", content: "Bye" });

      NoteDAO.deleteById(remove.id);

      expect(NoteDAO.findById(keep.id)).not.toBeNull();
      expect(NoteDAO.findMany()).toHaveLength(1);
    });
  });
});
