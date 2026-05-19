import request from "supertest";

import type { Response } from "supertest";
import type { Note } from "@/types/models";

import app from "@/app";

import { NoteDAO } from "@/daos/note.dao";

import { CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_NOT, MESSAGES_SUCCESS } from "@/constants/messages.constant";

describe("note.route", () => {
  describe("GET /api/v1/notes", () => {
    it("should return 200 with empty notes array when store is empty", async () => {
      const response: Response = await request(app).get("/api/v1/notes");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        code: CODES_SUCCESS.getAllNotes,
        message: MESSAGES_SUCCESS.getAllNotes,
        data: { notes: [] },
      });
    });

    it("should return 200 with existing notes", async () => {
      const note: Note = NoteDAO.create({ title: "Test", content: "Content" });

      const response: Response = await request(app).get("/api/v1/notes");

      expect(response.status).toBe(200);
      expect(response.body.data.notes).toHaveLength(1);
      expect(response.body.data.notes[0].id).toBe(note.id);
    });
  });

  describe("GET /api/v1/notes/:id", () => {
    it("should return 400 when id is not a valid integer", async () => {
      const response: Response = await request(app).get("/api/v1/notes/abc");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: CODES_NOT.validId,
        message: MESSAGES_NOT.validId,
      });
    });

    it("should return 400 when id is zero", async () => {
      const response: Response = await request(app).get("/api/v1/notes/0");

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(CODES_NOT.validId);
    });

    it("should return 400 when id is negative", async () => {
      const response: Response = await request(app).get("/api/v1/notes/-1");

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(CODES_NOT.validId);
    });

    it("should return 404 when note does not exist", async () => {
      const response: Response = await request(app).get("/api/v1/notes/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        code: CODES_NOT.foundNote,
        message: MESSAGES_NOT.foundNote,
      });
    });

    it("should return 200 with note when it exists", async () => {
      const note: Note = NoteDAO.create({ title: "Test note", content: "Content" });

      const response: Response = await request(app).get(`/api/v1/notes/${note.id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.note.id).toBe(note.id);
      expect(response.body.data.note.title).toBe("Test note");
    });
  });

  describe("POST /api/v1/notes", () => {
    it("should return 400 when title is missing", async () => {
      const response: Response = await request(app)
        .post("/api/v1/notes")
        .send({ content: "Content" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: CODES_NOT.validTitle,
        message: MESSAGES_NOT.validTitle,
      });
    });

    it("should return 400 when title is blank", async () => {
      const response: Response = await request(app)
        .post("/api/v1/notes")
        .send({ title: "   ", content: "Content" });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(CODES_NOT.validTitle);
    });

    it("should return 400 when content is missing", async () => {
      const response: Response = await request(app).post("/api/v1/notes").send({ title: "Title" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: CODES_NOT.validContent,
        message: MESSAGES_NOT.validContent,
      });
    });

    it("should return 400 when content is blank", async () => {
      const response: Response = await request(app)
        .post("/api/v1/notes")
        .send({ title: "Title", content: "   " });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(CODES_NOT.validContent);
    });

    it("should return 201 with the created note", async () => {
      const response: Response = await request(app)
        .post("/api/v1/notes")
        .send({ title: "New Note", content: "Body" });

      expect(response.status).toBe(201);
      expect(response.body.code).toBe(CODES_SUCCESS.createNote);
      expect(response.body.data.note.title).toBe("New Note");
      expect(response.body.data.note.content).toBe("Body");
      expect(response.body.data.note.id).toBeDefined();
    });

    it("should trim title and content before creating", async () => {
      const response: Response = await request(app)
        .post("/api/v1/notes")
        .send({ title: "  Trimmed  ", content: "  Content  " });

      expect(response.status).toBe(201);
      expect(response.body.data.note.title).toBe("Trimmed");
      expect(response.body.data.note.content).toBe("Content");
    });

    it("should persist the note so it appears in the list", async () => {
      await request(app).post("/api/v1/notes").send({ title: "Persisted", content: "Content" });

      const listResponse: Response = await request(app).get("/api/v1/notes");

      expect(listResponse.body.data.notes).toHaveLength(1);
      expect(listResponse.body.data.notes[0].title).toBe("Persisted");
    });
  });

  describe("PUT /api/v1/notes/:id", () => {
    it("should return 400 when id is not a valid integer", async () => {
      const response: Response = await request(app)
        .put("/api/v1/notes/abc")
        .send({ title: "Updated" });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(CODES_NOT.validId);
    });

    it("should return 400 when neither title nor content is provided", async () => {
      const created: Note = NoteDAO.create({ title: "Original", content: "Content" });

      const response: Response = await request(app).put(`/api/v1/notes/${created.id}`).send({});

      expect(response.status).toBe(400);
    });

    it("should return 400 when title is blank", async () => {
      const created: Note = NoteDAO.create({ title: "Original", content: "Content" });

      const response: Response = await request(app)
        .put(`/api/v1/notes/${created.id}`)
        .send({ title: "   " });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(CODES_NOT.validTitle);
    });

    it("should return 404 when note does not exist", async () => {
      const response: Response = await request(app)
        .put("/api/v1/notes/999")
        .send({ title: "Updated" });

      expect(response.status).toBe(404);
      expect(response.body.code).toBe(CODES_NOT.foundNote);
    });

    it("should return 200 with updated note when only title is provided", async () => {
      const note: Note = NoteDAO.create({ title: "Original", content: "Original content" });

      const response: Response = await request(app)
        .put(`/api/v1/notes/${note.id}`)
        .send({ title: "Updated Title" });

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(CODES_SUCCESS.updateNote);
      expect(response.body.data.note.title).toBe("Updated Title");
      expect(response.body.data.note.content).toBe("Original content");
      expect(response.body.data.note.id).toBe(note.id);
    });

    it("should return 200 with updated note when only content is provided", async () => {
      const note: Note = NoteDAO.create({ title: "Title", content: "Old" });

      const response: Response = await request(app)
        .put(`/api/v1/notes/${note.id}`)
        .send({ content: "New" });

      expect(response.status).toBe(200);
      expect(response.body.data.note.title).toBe("Title");
      expect(response.body.data.note.content).toBe("New");
    });

    it("should trim updated fields before saving", async () => {
      const note: Note = NoteDAO.create({ title: "Original", content: "Content" });

      const response: Response = await request(app)
        .put(`/api/v1/notes/${note.id}`)
        .send({ title: "  Updated  " });

      expect(response.status).toBe(200);
      expect(response.body.data.note.title).toBe("Updated");
    });
  });

  describe("DELETE /api/v1/notes/:id", () => {
    it("should return 400 when id is not a valid integer", async () => {
      const response: Response = await request(app).delete("/api/v1/notes/abc");

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(CODES_NOT.validId);
    });

    it("should return 404 when note does not exist", async () => {
      const response: Response = await request(app).delete("/api/v1/notes/999");

      expect(response.status).toBe(404);
      expect(response.body.code).toBe(CODES_NOT.foundNote);
    });

    it("should return 200 when note is deleted", async () => {
      const note: Note = NoteDAO.create({ title: "To delete", content: "Content" });

      const response: Response = await request(app).delete(`/api/v1/notes/${note.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        code: CODES_SUCCESS.deleteNote,
        message: MESSAGES_SUCCESS.deleteNote,
        data: null,
      });
    });

    it("should remove the note from the store after deletion", async () => {
      const note: Note = NoteDAO.create({ title: "To delete", content: "Content" });

      await request(app).delete(`/api/v1/notes/${note.id}`);

      const checkResponse: Response = await request(app).get(`/api/v1/notes/${note.id}`);
      expect(checkResponse.status).toBe(404);
    });
  });

  describe("Unknown route", () => {
    it("should return 404 NOT_FOUND_ROUTE for an unknown sub-path", async () => {
      const response: Response = await request(app).get("/api/v1/notes/123/unknown");

      expect(response.status).toBe(404);
      expect(response.body.code).toBe(CODES_NOT.foundRoute);
    });
  });
});
