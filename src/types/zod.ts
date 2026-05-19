import type { z } from "zod";
import type {
  noteCreateBodySchema,
  noteIdParamsSchema,
  noteUpdateBodySchema,
} from "@/schemas/note.schema";

export type NoteIdParams = z.infer<typeof noteIdParamsSchema>;
export type NoteCreateBody = z.infer<typeof noteCreateBodySchema>;
export type NoteUpdateBody = z.infer<typeof noteUpdateBodySchema>;
