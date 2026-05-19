import type { Note } from "@/types/models";
import type { NoteCreateBody, NoteUpdateBody } from "@/types/zod";

import { NoteDAO } from "@/daos/note.dao";

export const NoteService = {
  getAllNotes: (): Note[] => {
    return NoteDAO.findMany();
  },

  getNoteById: (id: number): Note | null => {
    return NoteDAO.findById(id);
  },

  createNote: (data: NoteCreateBody): Note => {
    return NoteDAO.create(data);
  },

  updateNote: (id: number, data: NoteUpdateBody): Note => {
    return NoteDAO.updateById(id, data);
  },

  deleteNote: (id: number): Note => {
    return NoteDAO.deleteById(id);
  },
};
