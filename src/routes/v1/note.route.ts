import { Router } from "express";

import { NoteController } from "@/controllers/note.controller";

import { validate } from "@/middlewares/validate.middleware";

import {
  noteCreateBodySchema,
  noteIdParamsSchema,
  noteUpdateBodySchema,
} from "@/schemas/note.schema";

const router = Router();

router.get("/", NoteController.getAll);
router.get("/:id", validate({ params: noteIdParamsSchema }), NoteController.getById);
router.post("/", validate({ body: noteCreateBodySchema }), NoteController.create);
router.put(
  "/:id",
  validate({ params: noteIdParamsSchema, body: noteUpdateBodySchema }),
  NoteController.update
);
router.delete("/:id", validate({ params: noteIdParamsSchema }), NoteController.delete);

export default router;
