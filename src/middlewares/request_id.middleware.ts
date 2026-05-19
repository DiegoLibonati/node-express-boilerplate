import { randomUUID } from "node:crypto";

import type { NextFunction, Request, Response } from "express";

const HEADER = "x-request-id";

export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  const incoming = req.header(HEADER);
  const id = incoming && incoming.length > 0 ? incoming : randomUUID();
  req.id = id;
  res.setHeader(HEADER, id);
  next();
};
