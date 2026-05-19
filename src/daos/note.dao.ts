import type { Note } from "@/types/models";
import type { NoteCreateBody, NoteUpdateBody } from "@/types/zod";

import { NotFoundError } from "@/errors/not_found.error";

let notes: Note[] = [];
let nextId = 1;

export const resetNoteStore = (): void => {
  notes = [];
  nextId = 1;
};

export const NoteDAO = {
  findMany: (): Note[] => [...notes].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),

  findById: (id: number): Note | null => notes.find((n) => n.id === id) ?? null,

  create: (data: NoteCreateBody): Note => {
    const now = new Date();
    const note: Note = { id: nextId++, ...data, createdAt: now, updatedAt: now };
    notes.push(note);
    return note;
  },

  updateById: (id: number, data: NoteUpdateBody): Note => {
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) throw new NotFoundError();
    const updated: Note = {
      ...notes[index]!,
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
      updatedAt: new Date(),
    };
    notes[index] = updated;
    return updated;
  },

  deleteById: (id: number): Note => {
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) throw new NotFoundError();
    const [deleted] = notes.splice(index, 1);
    return deleted!;
  },
};
