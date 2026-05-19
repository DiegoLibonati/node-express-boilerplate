import { envs } from "@/configs/env.config";
import { logger } from "@/configs/logger.config";

import app from "@/app";

const PORT = envs.PORT;
const ENV = envs.ENV;
const BASE_URL = envs.BASE_URL;

const onInit = (): void => {
  const baseUrl = ENV === "development" ? `http://localhost:${PORT}` : BASE_URL;
  logger.info({ env: ENV, baseUrl }, `Server running in ${ENV} mode on ${baseUrl}`);
};

const server = app.listen(PORT, onInit);

const shutdown = (): void => {
  server.close((err?: Error) => {
    process.exit(err ? 1 : 0);
  });

  setTimeout(() => {
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
