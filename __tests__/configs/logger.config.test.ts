interface LoggerShape {
  info: (msg: string) => void;
  error: (msg: string) => void;
  warn: (msg: string) => void;
  debug: (msg: string) => void;
  fatal: (msg: string) => void;
  level: string;
}

describe("logger.config", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach((): void => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  afterEach((): void => {
    process.env = originalEnv;
  });

  const loadLogger = (): LoggerShape => {
    const mod = jest.requireActual<{ logger: LoggerShape }>("@/configs/logger.config");
    return mod.logger;
  };

  it("should export a logger object with the standard pino log methods", () => {
    const logger: LoggerShape = loadLogger();

    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.fatal).toBe("function");
  });

  it("should use the LOG_LEVEL from envs", () => {
    process.env.LOG_LEVEL = "warn";

    const logger: LoggerShape = loadLogger();

    expect(logger.level).toBe("warn");
  });

  it("should default the level to info when LOG_LEVEL is not set", () => {
    delete process.env.LOG_LEVEL;

    const logger: LoggerShape = loadLogger();

    expect(logger.level).toBe("info");
  });

  it("should allow calling info without throwing", () => {
    process.env.NODE_ENV = "production";

    const logger: LoggerShape = loadLogger();

    expect((): void => {
      logger.info("test");
    }).not.toThrow();
  });
});
