import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { getEnvFileCandidates, loadEnvFiles } from "@/configs/dotenv.config";

describe("dotenv.config", () => {
  let originalEnv: NodeJS.ProcessEnv;
  let originalCwd: string;
  let workDir: string;

  beforeEach((): void => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    delete process.env.PORT;
    delete process.env.BASE_URL;
    originalCwd = process.cwd();
    workDir = mkdtempSync(join(tmpdir(), "dotenv-config-"));
    process.chdir(workDir);
  });

  afterEach((): void => {
    process.chdir(originalCwd);
    rmSync(workDir, { recursive: true, force: true });
    process.env = originalEnv;
  });

  const writeEnvFile = (file: string, contents: string): void => {
    writeFileSync(join(workDir, file), contents, "utf8");
  };

  describe("getEnvFileCandidates", () => {
    it("should return the four cascading files ordered by precedence", () => {
      expect(getEnvFileCandidates("development")).toEqual([
        ".env.development.local",
        ".env.local",
        ".env.development",
        ".env",
      ]);
    });

    it("should use the given mode in the mode-specific file names", () => {
      expect(getEnvFileCandidates("production")).toEqual([
        ".env.production.local",
        ".env.local",
        ".env.production",
        ".env",
      ]);
    });

    it("should only return the test-specific files when the mode is test", () => {
      expect(getEnvFileCandidates("test")).toEqual([".env.test.local", ".env.test"]);
    });
  });

  describe("loadEnvFiles", () => {
    it("should return an empty list when no env file exists", () => {
      process.env.NODE_ENV = "development";

      expect(loadEnvFiles()).toEqual([]);
    });

    it("should load .env into process.env and report it as loaded", () => {
      process.env.NODE_ENV = "development";
      writeEnvFile(".env", "PORT=6000\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env"]);
      expect(process.env.PORT).toBe("6000");
    });

    it("should not override variables already present in process.env", () => {
      process.env.NODE_ENV = "development";
      process.env.PORT = "7000";
      writeEnvFile(".env", "PORT=6000\n");

      loadEnvFiles();

      expect(process.env.PORT).toBe("7000");
    });

    it("should give .env.local precedence over .env", () => {
      process.env.NODE_ENV = "development";
      writeEnvFile(".env", "PORT=6000\nBASE_URL=https://base.test\n");
      writeEnvFile(".env.local", "PORT=6001\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env.local", ".env"]);
      expect(process.env.PORT).toBe("6001");
      expect(process.env.BASE_URL).toBe("https://base.test");
    });

    it("should give the mode-specific file precedence over .env", () => {
      process.env.NODE_ENV = "production";
      writeEnvFile(".env", "PORT=6000\n");
      writeEnvFile(".env.production", "PORT=6002\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env.production", ".env"]);
      expect(process.env.PORT).toBe("6002");
    });

    it("should give .env.<mode>.local precedence over every other file", () => {
      process.env.NODE_ENV = "development";
      writeEnvFile(".env", "PORT=6000\n");
      writeEnvFile(".env.local", "PORT=6001\n");
      writeEnvFile(".env.development", "PORT=6002\n");
      writeEnvFile(".env.development.local", "PORT=6003\n");

      loadEnvFiles();

      expect(process.env.PORT).toBe("6003");
    });

    it("should resolve the mode from .env when NODE_ENV is not set in the process", () => {
      delete process.env.NODE_ENV;
      writeEnvFile(".env", "NODE_ENV=production\nPORT=6000\n");
      writeEnvFile(".env.production", "PORT=6002\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env.production", ".env"]);
      expect(process.env.NODE_ENV).toBe("production");
      expect(process.env.PORT).toBe("6002");
    });

    it("should keep looking for NODE_ENV when a base file does not declare it", () => {
      delete process.env.NODE_ENV;
      writeEnvFile(".env.local", "PORT=6001\n");
      writeEnvFile(".env", "NODE_ENV=production\n");
      writeEnvFile(".env.production", "BASE_URL=https://prod.test\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env.local", ".env.production", ".env"]);
      expect(process.env.BASE_URL).toBe("https://prod.test");
      expect(process.env.PORT).toBe("6001");
    });

    it("should fall back to the development mode when NODE_ENV is declared nowhere", () => {
      delete process.env.NODE_ENV;
      writeEnvFile(".env.development", "PORT=6002\n");

      expect(loadEnvFiles()).toEqual([".env.development"]);
    });

    it("should ignore .env and .env.local under the test mode", () => {
      process.env.NODE_ENV = "test";
      writeEnvFile(".env", "PORT=6000\n");
      writeEnvFile(".env.local", "PORT=6001\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([]);
      expect(process.env.PORT).toBeUndefined();
    });

    it("should load .env.test under the test mode", () => {
      process.env.NODE_ENV = "test";
      writeEnvFile(".env", "PORT=6000\n");
      writeEnvFile(".env.test", "PORT=6004\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env.test"]);
      expect(process.env.PORT).toBe("6004");
    });
  });
});
