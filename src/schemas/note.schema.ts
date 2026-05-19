import { z } from "zod";

export const noteIdParamsSchema = z.object({
  id: z.string().regex(/^[1-9]\d*$/),
});

export const noteCreateBodySchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
});

export const noteUpdateBodySchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    content: z.string().trim().min(1).optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "At least one field is required",
  });
