import type { Note } from "@/types/models";
import type { NoteCreateBody, NoteUpdateBody } from "@/types/zod";

import { NoteService } from "@/services/note.service";

import { NoteDAO } from "@/daos/note.dao";

import { NotFoundError } from "@/errors/not_found.error";

import { mockNote } from "@tests/__mocks__/notes.mock";

const mockedNoteDAO = NoteDAO as jest.Mocked<typeof NoteDAO>;

jest.mock("@/daos/note.dao", () => ({
  NoteDAO: {
    findMany: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  },
}));

describe("note.service", () => {
  describe("getAllNotes", () => {
    it("should call NoteDAO.findMany and return the result", () => {
      const mockNotes: Note[] = [mockNote];
      mockedNoteDAO.findMany.mockReturnValue(mockNotes);

      const result: Note[] = NoteService.getAllNotes();

      expect(mockedNoteDAO.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockNotes);
    });

    it("should return an empty array when no notes exist", () => {
      mockedNoteDAO.findMany.mockReturnValue([]);

      const result: Note[] = NoteService.getAllNotes();

      expect(result).toEqual([]);
    });
  });

  describe("getNoteById", () => {
    it("should call NoteDAO.findById with the correct id and return the note", () => {
      mockedNoteDAO.findById.mockReturnValue(mockNote);

      const result: Note | null = NoteService.getNoteById(1);

      expect(mockedNoteDAO.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNote);
    });

    it("should return null when the note does not exist", () => {
      mockedNoteDAO.findById.mockReturnValue(null);

      const result: Note | null = NoteService.getNoteById(999);

      expect(result).toBeNull();
    });
  });

  describe("createNote", () => {
    it("should call NoteDAO.create with the payload and return the created note", () => {
      const payload: NoteCreateBody = { title: "New note", content: "Body" };
      mockedNoteDAO.create.mockReturnValue(mockNote);

      const result: Note = NoteService.createNote(payload);

      expect(mockedNoteDAO.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockNote);
    });
  });

  describe("updateNote", () => {
    it("should call NoteDAO.updateById with id and data and return the updated note", () => {
      const payload: NoteUpdateBody = { title: "Updated" };
      mockedNoteDAO.updateById.mockReturnValue(mockNote);

      const result: Note = NoteService.updateNote(1, payload);

      expect(mockedNoteDAO.updateById).toHaveBeenCalledWith(1, payload);
      expect(result).toEqual(mockNote);
    });

    it("should propagate NotFoundError when DAO throws", () => {
      mockedNoteDAO.updateById.mockImplementation(() => {
        throw new NotFoundError();
      });

      expect(() => NoteService.updateNote(999, { title: "x" })).toThrow(NotFoundError);
    });
  });

  describe("deleteNote", () => {
    it("should call NoteDAO.deleteById with the id and return the deleted note", () => {
      mockedNoteDAO.deleteById.mockReturnValue(mockNote);

      const result: Note = NoteService.deleteNote(1);

      expect(mockedNoteDAO.deleteById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNote);
    });

    it("should propagate NotFoundError when DAO throws", () => {
      mockedNoteDAO.deleteById.mockImplementation(() => {
        throw new NotFoundError();
      });

      expect(() => NoteService.deleteNote(999)).toThrow(NotFoundError);
    });
  });
});
