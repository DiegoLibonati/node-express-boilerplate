import type { NextFunction, Request, Response } from "express";

import { NoteService } from "@/services/note.service";

import { NotFoundError } from "@/errors/not_found.error";

import { CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS } from "@/constants/messages.constant";

export const NoteController = {
  getAll: (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const notes = NoteService.getAllNotes();
      res.status(200).json({
        code: CODES_SUCCESS.getAllNotes,
        message: MESSAGES_SUCCESS.getAllNotes,
        data: { notes },
      });
    } catch (e) {
      next(e);
    }
  },

  getById: (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
      const note = NoteService.getNoteById(Number(req.params.id));
      if (!note) throw new NotFoundError();
      res.status(200).json({
        code: CODES_SUCCESS.getNote,
        message: MESSAGES_SUCCESS.getNote,
        data: { note },
      });
    } catch (e) {
      next(e);
    }
  },

  create: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { title, content } = req.body as { title: string; content: string };
      const note = NoteService.createNote({ title, content });
      res.status(201).json({
        code: CODES_SUCCESS.createNote,
        message: MESSAGES_SUCCESS.createNote,
        data: { note },
      });
    } catch (e) {
      next(e);
    }
  },

  update: (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
      const { title, content } = req.body as { title?: string; content?: string };
      const data: { title?: string; content?: string } = {};
      if (title !== undefined) data.title = title;
      if (content !== undefined) data.content = content;
      const note = NoteService.updateNote(Number(req.params.id), data);
      res.status(200).json({
        code: CODES_SUCCESS.updateNote,
        message: MESSAGES_SUCCESS.updateNote,
        data: { note },
      });
    } catch (e) {
      next(e);
    }
  },

  delete: (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
      NoteService.deleteNote(Number(req.params.id));
      res.status(200).json({
        code: CODES_SUCCESS.deleteNote,
        message: MESSAGES_SUCCESS.deleteNote,
        data: null,
      });
    } catch (e) {
      next(e);
    }
  },
};
