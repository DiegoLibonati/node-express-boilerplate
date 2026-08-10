import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { parse } from "dotenv";

// Files are read from the highest precedence to the lowest and a key is only applied when it is
// still absent from process.env, so real environment variables (Docker, CI, shell) always win over
// files. `.env` and `.env.local` are skipped under NODE_ENV=test to keep runs reproducible.

const DEFAULT_MODE = "development";
const MODE_SOURCE_FILES = [".env.local", ".env"];

const readFileOrNull = (file: string): string | null => {
  try {
    return readFileSync(resolve(process.cwd(), file), "utf8");
  } catch {
    return null;
  }
};

const resolveMode = (): string => {
  const fromProcess = process.env.NODE_ENV?.trim();

  if (fromProcess) {
    return fromProcess;
  }

  for (const file of MODE_SOURCE_FILES) {
    const content = readFileOrNull(file);

    if (content === null) {
      continue;
    }

    const declared = parse(content).NODE_ENV?.trim();

    if (declared) {
      return declared;
    }
  }

  return DEFAULT_MODE;
};

const applyEnvFile = (file: string): boolean => {
  const content = readFileOrNull(file);

  if (content === null) {
    return false;
  }

  for (const [key, value] of Object.entries(parse(content))) {
    process.env[key] ??= value;
  }

  return true;
};

export const getEnvFileCandidates = (mode: string): string[] => {
  if (mode === "test") {
    return [`.env.${mode}.local`, `.env.${mode}`];
  }

  return [`.env.${mode}.local`, ".env.local", `.env.${mode}`, ".env"];
};

export const loadEnvFiles = (): string[] =>
  getEnvFileCandidates(resolveMode()).filter((file) => applyEnvFile(file));
