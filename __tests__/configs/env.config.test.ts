import type { Envs } from "@/types/env";

describe("env.config", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach((): void => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  afterEach((): void => {
    process.env = originalEnv;
  });

  const loadEnvs = (): Envs => {
    const mod = jest.requireActual<{ envs: Envs }>("@/configs/env.config");
    return mod.envs;
  };

  it("should expose envs as an object", () => {
    const envs: Envs = loadEnvs();

    expect(typeof envs).toBe("object");
  });

  describe("ENV", () => {
    it("should use the NODE_ENV value when set to a valid value", () => {
      process.env.NODE_ENV = "production";

      expect(loadEnvs().ENV).toBe("production");
    });

    it("should default to development when NODE_ENV is not set", () => {
      delete process.env.NODE_ENV;

      expect(loadEnvs().ENV).toBe("development");
    });

    it("should throw when NODE_ENV is invalid", () => {
      process.env.NODE_ENV = "invalid";

      expect(() => loadEnvs()).toThrow(/Invalid environment variables/);
    });
  });

  describe("PORT", () => {
    it("should coerce a numeric string to a number", () => {
      process.env.PORT = "3000";

      const envs: Envs = loadEnvs();

      expect(envs.PORT).toBe(3000);
      expect(typeof envs.PORT).toBe("number");
    });

    it("should default to 5050 when not set", () => {
      delete process.env.PORT;

      expect(loadEnvs().PORT).toBe(5050);
    });

    it("should throw when PORT is not a positive integer", () => {
      process.env.PORT = "0";

      expect(() => loadEnvs()).toThrow(/Invalid environment variables/);
    });

    it("should throw when PORT is not numeric", () => {
      process.env.PORT = "abc";

      expect(() => loadEnvs()).toThrow(/Invalid environment variables/);
    });
  });

  describe("BASE_URL", () => {
    it("should default to empty string when not set", () => {
      delete process.env.BASE_URL;

      expect(loadEnvs().BASE_URL).toBe("");
    });

    it("should expose the value when set", () => {
      process.env.BASE_URL = "https://example.com";

      expect(loadEnvs().BASE_URL).toBe("https://example.com");
    });
  });

  describe("LOG_LEVEL", () => {
    it("should default to info when not set", () => {
      delete process.env.LOG_LEVEL;

      expect(loadEnvs().LOG_LEVEL).toBe("info");
    });

    it("should accept valid log levels", () => {
      process.env.LOG_LEVEL = "debug";

      expect(loadEnvs().LOG_LEVEL).toBe("debug");
    });

    it("should throw when LOG_LEVEL is invalid", () => {
      process.env.LOG_LEVEL = "loud";

      expect(() => loadEnvs()).toThrow(/Invalid environment variables/);
    });
  });

  describe("RATE_LIMIT_WINDOW_MS", () => {
    it("should default to 15 minutes in ms when not set", () => {
      delete process.env.RATE_LIMIT_WINDOW_MS;

      expect(loadEnvs().RATE_LIMIT_WINDOW_MS).toBe(15 * 60 * 1000);
    });

    it("should coerce a numeric string", () => {
      process.env.RATE_LIMIT_WINDOW_MS = "60000";

      expect(loadEnvs().RATE_LIMIT_WINDOW_MS).toBe(60000);
    });

    it("should throw when RATE_LIMIT_WINDOW_MS is not positive", () => {
      process.env.RATE_LIMIT_WINDOW_MS = "0";

      expect(() => loadEnvs()).toThrow(/Invalid environment variables/);
    });
  });

  describe("RATE_LIMIT_MAX", () => {
    it("should default to 0 when not set", () => {
      delete process.env.RATE_LIMIT_MAX;

      expect(loadEnvs().RATE_LIMIT_MAX).toBe(0);
    });

    it("should coerce a numeric string", () => {
      process.env.RATE_LIMIT_MAX = "100";

      expect(loadEnvs().RATE_LIMIT_MAX).toBe(100);
    });

    it("should accept zero as a valid value", () => {
      process.env.RATE_LIMIT_MAX = "0";

      expect(loadEnvs().RATE_LIMIT_MAX).toBe(0);
    });

    it("should throw when RATE_LIMIT_MAX is negative", () => {
      process.env.RATE_LIMIT_MAX = "-1";

      expect(() => loadEnvs()).toThrow(/Invalid environment variables/);
    });
  });

  describe("BODY_LIMIT", () => {
    it("should default to 1gb when not set", () => {
      delete process.env.BODY_LIMIT;

      expect(loadEnvs().BODY_LIMIT).toBe("1gb");
    });

    it("should expose the value when set", () => {
      process.env.BODY_LIMIT = "100kb";

      expect(loadEnvs().BODY_LIMIT).toBe("100kb");
    });
  });

  describe("SEED_DEFAULT_DATA", () => {
    it("should default to false when not set", () => {
      delete process.env.SEED_DEFAULT_DATA;

      expect(loadEnvs().SEED_DEFAULT_DATA).toBe(false);
    });

    it("should coerce 'true' to true", () => {
      process.env.SEED_DEFAULT_DATA = "true";

      expect(loadEnvs().SEED_DEFAULT_DATA).toBe(true);
    });

    it("should coerce 'false' to false", () => {
      process.env.SEED_DEFAULT_DATA = "false";

      expect(loadEnvs().SEED_DEFAULT_DATA).toBe(false);
    });
  });
});
