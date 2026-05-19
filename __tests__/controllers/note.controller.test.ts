import type { NextFunction, Request, Response } from "express";
import type { Note } from "@/types/models";

import { NoteController } from "@/controllers/note.controller";

import { NoteService } from "@/services/note.service";

import { NotFoundError } from "@/errors/not_found.error";

import { CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS } from "@/constants/messages.constant";

import { mockNote } from "@tests/__mocks__/notes.mock";

const mockedNoteService = NoteService as jest.Mocked<typeof NoteService>;

jest.mock("@/services/note.service", () => ({
  NoteService: {
    getAllNotes: jest.fn(),
    getNoteById: jest.fn(),
    createNote: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
  },
}));

const buildReq = (body: unknown = {}): Request => ({ params: {}, body }) as unknown as Request;

const buildReqWithId = (id: string, body: unknown = {}): Request<{ id: string }> =>
  ({ params: { id }, body }) as unknown as Request<{ id: string }>;

const buildRes = (): Response => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return mockRes as unknown as Response;
};

describe("note.controller", () => {
  describe("getAll", () => {
    it("should return 200 with all notes", () => {
      const notes: Note[] = [mockNote];
      mockedNoteService.getAllNotes.mockReturnValue(notes);
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      NoteController.getAll(buildReq(), res, next);

      expect(mockedNoteService.getAllNotes).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getAllNotes,
        message: MESSAGES_SUCCESS.getAllNotes,
        data: { notes },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with the error when service throws", () => {
      const error: Error = new Error("unexpected");
      mockedNoteService.getAllNotes.mockImplementation(() => {
        throw error;
      });
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      NoteController.getAll(buildReq(), res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("should return 200 with the note when it exists", () => {
      mockedNoteService.getNoteById.mockReturnValue(mockNote);
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      NoteController.getById(buildReqWithId("1"), res, next);

      expect(mockedNoteService.getNoteById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getNote,
        message: MESSAGES_SUCCESS.getNote,
        data: { note: mockNote },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with NotFoundError when service returns null", () => {
      mockedNoteService.getNoteById.mockReturnValue(null);
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      NoteController.getById(buildReqWithId("1"), res, next);

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should call next with the error when service throws", () => {
      const error: Error = new Error("unexpected");
      mockedNoteService.getNoteById.mockImplementation(() => {
        throw error;
      });
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      NoteController.getById(buildReqWithId("1"), res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("create", () => {
    it("should return 201 with the created note", () => {
      mockedNoteService.createNote.mockReturnValue(mockNote);
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      NoteController.create(buildReq({ title: "Title", content: "Content" }), res, next);

      expect(mockedNoteService.createNote).toHaveBeenCalledWith({
        title: "Title",
        content: "Content",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.createNote,
        message: MESSAGES_SUCCESS.createNote,
        data: { note: mockNote },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with the error when service throws", () => {
      const error: Error = new Error("unexpected");
      mockedNoteService.createNote.mockImplementation(() => {
        throw error;
      });
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      NoteController.create(buildReq({ title: "T", content: "C" }), res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should return 200 with the updated note", () => {
      mockedNoteService.updateNote.mockReturnValue(mockNote);
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      NoteController.update(buildReqWithId("1", { title: "Updated" }), res, next);

      expect(mockedNoteService.updateNote).toHaveBeenCalledWith(1, { title: "Updated" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.updateNote,
        message: MESSAGES_SUCCESS.updateNote,
        data: { note: mockNote },
      });
    });

    it("should call service with content only when title is undefined", () => {
      mockedNoteService.updateNote.mockReturnValue(mockNote);
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      NoteController.update(buildReqWithId("1", { content: "Updated content" }), res, next);

      expect(mockedNoteService.updateNote).toHaveBeenCalledWith(1, {
        content: "Updated content",
      });
    });

    it("should call service with both fields when both are provided", () => {
      mockedNoteService.updateNote.mockReturnValue(mockNote);
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      NoteController.update(buildReqWithId("1", { title: "T", content: "C" }), res, next);

      expect(mockedNoteService.updateNote).toHaveBeenCalledWith(1, { title: "T", content: "C" });
    });

    it("should call service with empty data when neither field is provided", () => {
      mockedNoteService.updateNote.mockReturnValue(mockNote);
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      NoteController.update(buildReqWithId("1", {}), res, next);

      expect(mockedNoteService.updateNote).toHaveBeenCalledWith(1, {});
    });

    it("should call next with NotFoundError when service throws NotFoundError", () => {
      const error: NotFoundError = new NotFoundError();
      mockedNoteService.updateNote.mockImplementation(() => {
        throw error;
      });
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      NoteController.update(buildReqWithId("1", { title: "X" }), res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should return 200 when note is deleted", () => {
      mockedNoteService.deleteNote.mockReturnValue(mockNote);
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      NoteController.delete(buildReqWithId("1"), res, next);

      expect(mockedNoteService.deleteNote).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.deleteNote,
        message: MESSAGES_SUCCESS.deleteNote,
        data: null,
      });
    });

    it("should call next with NotFoundError when service throws NotFoundError", () => {
      const error: NotFoundError = new NotFoundError();
      mockedNoteService.deleteNote.mockImplementation(() => {
        throw error;
      });
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      NoteController.delete(buildReqWithId("1"), res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should call next with the error when service throws an unexpected error", () => {
      const error: Error = new Error("unexpected");
      mockedNoteService.deleteNote.mockImplementation(() => {
        throw error;
      });
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      NoteController.delete(buildReqWithId("1"), res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
