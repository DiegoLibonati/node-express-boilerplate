# Node.js + Express + TypeScript Boilerplate

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Description

**node-express-boilerplate** is a production-ready starting point for building REST APIs with Node.js, Express, and TypeScript. It is not a framework or a library — it is the foundation you clone once and stop rebuilding from scratch on every new backend project.

This repository is the REST + in-memory base. The same architecture also ships as three specialized variants — PostgreSQL + Prisma, Socket.IO, and GraphQL. See [Other versions](#other-versions).

**The problem it solves:** every Node.js + Express + TypeScript project starts with the same repetitive decisions — how to structure folders, how to wire up middleware, where to put types, how to handle environment variables safely, and how to configure linting and formatting so they actually block bad code before it reaches the repo. This boilerplate answers all of those decisions upfront, with a consistent, lightweight architecture that scales to real applications without introducing unnecessary complexity.

**What it includes:**

- **Express 4 + TypeScript 5** — strict typing enforced throughout, with `NodeNext` module resolution for clean CommonJS output and path aliases (`@/`) for readable imports.
- **In-memory store** — the DAO layer uses a module-level array as the data store. It includes a `Note` model as a reference CRUD implementation. Replace the store with any database or ORM of your choice — the layers above it stay unchanged.
- **Docker optional, not mandatory** — separate `Dockerfile.development` and `Dockerfile.production` plus Compose files for the container workflow, and a `dotenv` loader with cascading `.env` files for running straight on the host with `npm run dev` / `npm start`. Both paths read the same variables; neither is required by the other.
- **Layered architecture** — clear separation between DAOs (data access), Services (business logic), Controllers (HTTP handling), and Routes. Each layer has a single responsibility and depends only on the layer below it.
- **Zod-validated environment configuration** — `.env` files are loaded by `dotenv` (never overriding real environment variables), then parsed and coerced through a Zod schema at startup and composed into a typed `Envs` object. Invalid variables crash the process with a structured error message before the HTTP server binds.
- **Zod request validation** — `validate` middleware parses `params`, `query`, and `body` against per-route Zod schemas. Failures are mapped to `BadRequestError` with field-aware response codes.
- **Typed error hierarchy** — `AppError` base class plus `BadRequestError`, `UnauthorizedError`, `NotFoundError`, and `ConflictError`. Thrown anywhere in the stack and converted to consistent HTTP responses by the centralized error handler.
- **Security middlewares** — `helmet` for hardened response headers, `express-rate-limit` for opt-in IP throttling, `x-powered-by` disabled, and per-request `x-request-id` propagation for traceability.
- **Pino structured logging** — JSON logs in production, pretty-printed in development via `pino-pretty`. `pino-http` attaches a child logger to each request keyed by request id, and the error handler logs 5xx errors with stack traces.
- **Health endpoints** — `GET /api/v1/health/live` and `GET /api/v1/health/ready` for orchestrator liveness/readiness probes. The production Docker image ships a `HEALTHCHECK` wired to the live endpoint.
- **Jest + Supertest** — test suite configured with `ts-jest`, in-memory store reset between tests via `resetNoteStore`, and path alias mapping so tests import from `@/` just like source files.
- **ESLint + Prettier + Husky + lint-staged** — pre-commit hooks block commits with linting errors and auto-format staged files. No manual formatting steps required.
- **GitHub Actions CI** — `.github/workflows/ci.yml` runs lint, format check, type check, `npm audit`, the test suite, and Docker image builds for both `Dockerfile.development` and `Dockerfile.production` on every push and PR to `main`.

**How to use it:**

1. Clone the repository and install dependencies.
2. Copy `.env.example` to `.env` and fill in your values (optional — every key has a default).
3. Start it the way you prefer: Docker Compose, or `npm run dev` directly on your machine.
4. Replace the `Note` model, DAO, service, controller, and routes with your own domain logic — the folder structure, middleware setup, error handling, and tooling stay exactly as they are.

The next sections walk through the technology stack, the local setup, the runtime configuration, and finally the path to a deployable production build.

## Technologies Used

1. Node.js
2. TypeScript
3. Express
4. Docker

## Libraries Used

### Dependencies

```
"dotenv": "^17.4.2"
"express": "^4.21.0"
"express-rate-limit": "^8.5.2"
"helmet": "^8.1.0"
"pino": "^10.3.1"
"pino-http": "^11.0.0"
"zod": "^4.4.3"
```

### DevDependencies

```
"@eslint/js": "^9.0.0"
"@types/express": "^5.0.0"
"@types/jest": "^30.0.0"
"@types/node": "^22.0.0"
"@types/supertest": "^6.0.2"
"eslint": "^9.0.0"
"eslint-config-prettier": "^9.0.0"
"eslint-plugin-prettier": "^5.0.0"
"globals": "^15.0.0"
"husky": "^9.0.0"
"jest": "^30.0.0"
"lint-staged": "^15.0.0"
"pino-pretty": "^13.1.3"
"prettier": "^3.0.0"
"supertest": "^7.0.0"
"ts-jest": "^29.4.6"
"tsc-alias": "^1.8.16"
"tsx": "^4.0.0"
"typescript": "^5.5.3"
"typescript-eslint": "^8.0.0"
```

## Getting Started

Two supported ways to run the API — pick one, they are interchangeable and read the same variables. In both cases the API is available at `http://localhost:5050`.

### Option A — Local (no Docker)

> **Requirements:** Node.js `>=22` (the version in `.nvmrc`; `engine-strict` is on, so `npm install` fails on older versions).

1. Clone the repository.
2. Navigate to the project folder.
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and fill in the values (see [Env Keys](#env-keys)). Optional — every key has a default.
5. Start the dev server: `npm run dev`

`.env` is loaded automatically by `dotenv` at startup (see [Environment files](#environment-files)); no extra flag or wrapper is needed. The same applies to `npm start` after `npm run build`.

| Command              | Description                      |
| -------------------- | -------------------------------- |
| `npm run dev`        | Start development server (watch) |
| `npm run build`      | Compile TypeScript into `dist/`  |
| `npm start`          | Run the compiled server          |
| `npm run type-check` | Run TypeScript type checking     |

### Option B — Docker

> **Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) must be installed.

1. Clone the repository.
2. Navigate to the project folder.
3. Copy `.env.example` to `.env` and fill in the values (see [Env Keys](#env-keys) for the full reference).
4. Build the Docker image: `docker-compose -f dev.docker-compose.yml build --no-cache`
5. Start the container: `docker-compose -f dev.docker-compose.yml up --force-recreate`

Compose injects `.env` through `env_file`, so the variables reach the container as real environment variables and take precedence over any file inside the image. The file is declared with `required: false`, so the stack also starts without a `.env` (needs Docker Compose `>=2.24`) and falls back to the schema defaults.

### Pre-Commit for Development

Code quality and formatting are enforced automatically on every commit by ESLint, Prettier, Husky, and lint-staged. No manual formatting step is required, and commits with errors are blocked before they reach the repo.

#### ESLint

Configured with TypeScript strict rules (`strictTypeChecked` + `stylisticTypeChecked`):

- Explicit return types required on all functions
- No `any` type allowed
- Consistent type imports enforced (`import type`)
- Interfaces preferred over type aliases
- No unused variables (args prefixed with `_` are exempt)
- `===` required — no loose equality
- `console` usage warns; `debugger` is an error
- Relaxed rules inside `__tests__/` to allow unsafe assertions and `any` in test code

#### Prettier

Automatic code formatting on save and on commit:

- 2 spaces indentation
- Semicolons required
- Double quotes
- Trailing commas (ES5)
- Max line width: 100 characters
- LF line endings

#### Husky + lint-staged

Pre-commit hooks that automatically:

- Run ESLint with auto-fix on staged `.ts` files
- Format `.ts`, `.json`, and `.md` files with Prettier
- Block commits with linting errors

#### Available Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run lint`         | Check for linting errors         |
| `npm run lint:fix`     | Fix linting errors               |
| `npm run lint:all`     | Fix linting errors (src + tests) |
| `npm run format`       | Format code with Prettier        |
| `npm run format:check` | Check code formatting            |
| `npm run format:all`   | Format code (src + tests)        |

## Env Keys

Variables consumed by `src/configs/env.config.ts`. They are loaded from the [environment files](#environment-files) below, then parsed and coerced through a Zod schema at startup — invalid values cause the process to throw with a structured error message before the HTTP server binds. Every key is optional and falls back to the default listed below.

| Key                    | Description                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `PORT`                 | Port the HTTP server listens on. Default: `5050`.                                               |
| `NODE_ENV`             | Runtime environment (`development`, `production`, `test`). Default: `development`.              |
| `BASE_URL`             | Base URL of the API (optional).                                                                 |
| `LOG_LEVEL`            | Pino log level (`fatal`, `error`, `warn`, `info`, `debug`, `trace`, `silent`). Default: `info`. |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window in milliseconds. Default: `900000` (15 min).                                  |
| `RATE_LIMIT_MAX`       | Max requests per window per IP. `0` disables rate limiting. Default: `0`.                       |
| `BODY_LIMIT`           | JSON / urlencoded body size limit (e.g. `100kb`, `1mb`, `1gb`). Default: `1gb`.                 |
| `SEED_DEFAULT_DATA`    | Whether to seed default data on startup (`true`/`false`). Default: `false`.                     |
| `CHOKIDAR_USEPOLLING`  | Enable polling for file watching (`true`/`false`). Required on Docker.                          |
| `CHOKIDAR_INTERVAL`    | Polling interval in milliseconds (e.g. `100`).                                                  |

```bash
PORT=5050
NODE_ENV=development
BASE_URL=
SEED_DEFAULT_DATA=false

LOG_LEVEL=info

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=0

BODY_LIMIT=1gb

CHOKIDAR_USEPOLLING=true
CHOKIDAR_INTERVAL=100
```

### Environment files

`src/configs/dotenv.config.ts` runs before the Zod schema is evaluated and populates `process.env` from `.env` files found in the process working directory. Files are read from the highest precedence to the lowest, and a key is only applied when it is still unset:

| Precedence | File                    | Purpose                                                        |
| ---------- | ----------------------- | -------------------------------------------------------------- |
| 1          | _real environment_      | Docker `env_file`, CI secrets, shell exports — always win.     |
| 2          | `.env.<NODE_ENV>.local` | Machine-specific overrides for one environment. Git-ignored.   |
| 3          | `.env.local`            | Machine-specific overrides for every environment. Git-ignored. |
| 4          | `.env.<NODE_ENV>`       | Shared per-environment values.                                 |
| 5          | `.env`                  | Shared defaults for every environment.                         |

Rules worth knowing:

- **Real environment variables always win.** Nothing in a file ever overwrites a variable that is already set, which is what keeps the Docker, CI, and hosted-platform workflows intact — there, no `.env` file exists at all and the loader simply finds nothing.
- **`NODE_ENV` selects the mode.** It is read from the process first, then from `.env.local` / `.env`, and defaults to `development`.
- **Tests are isolated.** Under `NODE_ENV=test` only `.env.test.local` and `.env.test` are read, so a developer's local `.env` can never change test results.
- **Missing files are not an error.** With no file at all, the Zod defaults apply and the process starts normally.
- **Nothing is committed.** `.gitignore` excludes every `.env*` file except `.env.example`, and `.dockerignore` keeps them out of images.

The startup log line lists which files were actually applied:

```
INFO: Server running in development mode on http://localhost:5050
    env: "development"
    baseUrl: "http://localhost:5050"
    envFiles: [".env"]
```

## Project Structure

```
node-express-boilerplate/
├── .github/
│   └── workflows/
│       └── ci.yml                      # Lint, audit, test, and Docker build pipeline
├── .vscode/
│   └── extensions.json                 # Recommended VS Code extensions
├── __tests__/                          # Test suite
│   ├── __mocks__/
│   │   └── notes.mock.ts               # Shared mock Note object
│   └── jest.setup.ts                   # Per-test setup (timeout + store reset)
├── src/
│   ├── configs/
│   │   ├── dotenv.config.ts            # Cascading .env file loader (never overrides real env)
│   │   ├── env.config.ts               # Zod-validated environment composition
│   │   └── logger.config.ts            # Pino logger (pretty in dev, JSON in prod)
│   ├── constants/
│   │   ├── codes.constant.ts           # Response code strings
│   │   └── messages.constant.ts        # Response message strings
│   ├── controllers/
│   │   ├── health.controller.ts        # Liveness / readiness handlers
│   │   └── note.controller.ts          # HTTP handlers for the Note resource
│   ├── daos/
│   │   └── note.dao.ts                 # In-memory data store (array + CRUD operations)
│   ├── errors/
│   │   ├── app.error.ts                # Base AppError (status + code + message)
│   │   ├── bad_request.error.ts        # 400 error
│   │   ├── conflict.error.ts           # 409 error
│   │   ├── not_found.error.ts          # 404 error
│   │   └── unauthorized.error.ts       # 401 error
│   ├── helpers/
│   │   ├── get_exception_message.helper.ts  # Maps AppError instances to HTTP responses
│   │   └── is_integer.helper.ts             # Validates string as positive integer
│   ├── middlewares/
│   │   ├── error_handler.middleware.ts      # Catches and formats unhandled errors
│   │   ├── not_found_handler.middleware.ts  # Returns 404 for unmatched routes
│   │   ├── rate_limit.middleware.ts         # IP rate limiter (opt-in via env)
│   │   ├── request_id.middleware.ts         # Generates / propagates x-request-id
│   │   └── validate.middleware.ts           # Zod-based params/query/body validation
│   ├── routes/
│   │   ├── v1/
│   │   │   ├── health.route.ts         # /health/live and /health/ready
│   │   │   └── note.route.ts           # Note CRUD route definitions
│   │   └── index.ts                    # Mounts all v1 routes under /api/v1
│   ├── schemas/
│   │   └── note.schema.ts              # Zod schemas for note params/body
│   ├── services/
│   │   └── note.service.ts             # Business logic layer
│   ├── types/
│   │   ├── app.ts                      # Env, LogLevel, Request augmentation, ValidateConfig
│   │   ├── constants.ts                # Types for code/message constant maps
│   │   ├── env.ts                      # Envs interface
│   │   ├── helpers.ts                  # ExceptionInfo interface
│   │   ├── models.ts                   # Note interface
│   │   └── zod.ts                      # Inferred types from Zod schemas
│   ├── app.ts                          # Express app setup (middleware + routes)
│   └── server.ts                       # HTTP server bootstrap + graceful shutdown
├── .editorconfig                       # Editor defaults (encoding, indent, EOL)
├── .env.example                        # Environment variable template
├── .npmrc                              # engine-strict for Node version enforcement
├── .nvmrc                              # Pinned Node version (22)
├── dev.docker-compose.yml              # Development stack
├── prod.docker-compose.yml             # Production stack
├── Dockerfile.development              # Dev image (tsx watch + hot reload)
├── Dockerfile.production               # Production image (multi-stage build + HEALTHCHECK)
├── eslint.config.js                    # ESLint flat config
├── jest.config.js                      # Jest configuration
├── tsconfig.base.json                  # Shared TypeScript base config
├── tsconfig.app.json                   # App build config
├── tsconfig.test.json                  # Test config
└── tsconfig.json                       # Project references root
```

| Folder / File      | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| `.github/`         | GitHub Actions workflows (CI pipeline)                                |
| `.vscode/`         | Recommended editor extensions                                         |
| `__tests__/`       | Test files plus global Jest setup hooks                               |
| `src/configs/`     | Env file loading, validation, composition, and logger setup           |
| `src/constants/`   | Centralized response codes and messages                               |
| `src/controllers/` | One controller per resource; maps HTTP requests to service calls      |
| `src/daos/`        | Data access layer; in-memory store lives here                         |
| `src/errors/`      | Typed error classes (`AppError` and its HTTP-status-aware subclasses) |
| `src/helpers/`     | Pure utility functions with no side effects                           |
| `src/middlewares/` | Express middleware: errors, 404s, rate limit, request id, validation  |
| `src/routes/`      | Route definitions grouped by version (`v1/`)                          |
| `src/schemas/`     | Zod schemas used by the validation middleware                         |
| `src/services/`    | Business logic layer between controllers and DAOs                     |
| `src/types/`       | TypeScript interfaces and types, split by concern                     |

## Architecture & Design Patterns

The folder layout above maps directly onto the layered design described below — each top-level folder under `src/` corresponds to one layer or one cross-cutting concern.

### Layered Architecture

The codebase is organized into four explicit layers, each with a single responsibility. A layer only depends on the layer directly below it — no skipping layers.

```
Routes → Controllers → Services → DAOs
```

| Layer           | Responsibility                                                              |
| --------------- | --------------------------------------------------------------------------- |
| **Routes**      | Declare HTTP method + path and delegate to the corresponding controller.    |
| **Controllers** | Parse and validate the HTTP request, call the service, return the response. |
| **Services**    | Contain business logic. Orchestrate calls to one or more DAOs.              |
| **DAOs**        | Execute data access operations. No logic beyond data access.                |

### In-Memory Store

The DAO layer uses a module-level array (`notes: Note[]`) and an auto-incrementing `nextId` counter as the backing store. All CRUD operations act on this array. A `resetNoteStore` function is exported for use in tests to ensure a clean slate between test runs.

To replace the in-memory store with a real database, only the DAO layer needs to change — the service, controller, and route layers remain untouched.

### Fail-Fast Initialization

`.env` files are loaded first (see [Environment files](#environment-files)), without ever overriding a variable that the real environment already provides. The resulting `process.env` is then parsed at startup through a Zod schema and composed into a typed `Envs` object. If any value fails coercion, the process throws immediately — listing every offending key — before the HTTP server binds. This prevents silent misconfiguration from reaching production.

### Request Validation

The `validate` middleware accepts a `{ params?, query?, body? }` map of Zod schemas, parses the matching `Request` fields, and assigns the parsed result back to `req` so controllers consume already-validated, typed input. Validation failures are mapped to a `BadRequestError` with a field-aware code and message (e.g. invalid `id` vs. invalid `title`).

Per-resource schemas live in `src/schemas/` and their inferred TypeScript types live in `src/types/zod.ts`, replacing the previous hand-written DTO interfaces. This keeps a single source of truth between runtime validation and compile-time types.

### Centralized Error Handling

All errors flow to `errorHandler`, a single Express error middleware registered at the end of the middleware chain. Any error that extends `AppError` carries its own `status`, `code`, and `message`, which `getExceptionMessage` forwards directly to the response. Anything else collapses to a generic 500.

The error hierarchy (`AppError` → `BadRequestError` / `UnauthorizedError` / `NotFoundError` / `ConflictError`) lets any layer throw a domain error without knowing about HTTP, while still producing a consistent client-facing response. 5xx errors are logged with stack traces; 4xx errors are not (they are caller mistakes, not server problems).

### Security & Observability Middleware

A small middleware stack hardens and instruments every request:

- `helmet` sets a baseline of secure response headers and `x-powered-by` is disabled explicitly.
- `requestId` reads or generates an `x-request-id` and exposes it on `req.id` plus the response header — useful for correlating logs across systems.
- `pino-http` attaches a per-request child logger keyed by `req.id`, so every log line emitted while handling a request is automatically correlated.
- `rateLimiter` applies `express-rate-limit` only when `RATE_LIMIT_MAX > 0`; otherwise it is a no-op passthrough, so the boilerplate stays off by default.
- `express.json` / `express.urlencoded` use `envs.BODY_LIMIT` to cap incoming payloads.

### Structured Logging

`pino` is used for all application logging. In development, output is piped through `pino-pretty` for human-readable, colorized logs. In production, output is JSON for ingestion by log aggregators. The logger is configured once in `src/configs/logger.config.ts` and imported wherever logging is needed; HTTP request/response logging is handled automatically by `pino-http`.

### Health Endpoints

Two endpoints are exposed for orchestrators and load balancers:

- `GET /api/v1/health/live` — process is alive.
- `GET /api/v1/health/ready` — process is ready to receive traffic.

The production Docker image ships a `HEALTHCHECK` directive that polls `/api/v1/health/live` on the configured port.

### Graceful Shutdown

The server listens for `SIGTERM` and `SIGINT` signals. On shutdown, it stops accepting new connections and exits cleanly. A 10-second safety timeout forces exit if the shutdown stalls.

## Testing

The test suite uses Jest with `ts-jest`, Supertest for HTTP-level assertions, and the `resetNoteStore` hook to clear the in-memory DAO between tests — keeping each test fully isolated.

1. Navigate to the project folder.
2. Run the suite:

```bash
npm test
```

For a coverage report:

```bash
npm run test:coverage
```

| Command                 | Description             |
| ----------------------- | ----------------------- |
| `npm run test`          | Run tests               |
| `npm run test:watch`    | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

## Security Audit

Once the suite is green, audit dependencies before producing a build.

Check for vulnerabilities:

```bash
npm audit
```

Apply automatic fixes (when a safe upgrade exists):

```bash
npm audit fix
```

## Build

With tests passing and dependencies clean, compile the production artifacts.

The production pipeline runs `tsc` (TypeScript → JavaScript in `dist/`) followed by `tsc-alias` (rewrites `@/` path aliases to relative paths so the compiled output runs without a runtime resolver).

| Command         | Description             |
| --------------- | ----------------------- |
| `npm run build` | Build for production    |
| `npm run start` | Start production server |

The production Docker image wraps this same build inside a multi-stage flow:

- **Multi-stage build** — a `builder` stage compiles TypeScript (`tsc`) and resolves path aliases (`tsc-alias`), then a lean `runner` stage copies only the compiled `dist/` and production `node_modules`. Dev dependencies are stripped with `npm prune --omit=dev`.
- **Non-root user** — the runner stage creates a dedicated `appuser` and drops root privileges before the process starts.
- **No source maps, no hot reload** — the container runs `node dist/server.js` directly.

## Continuous Integration

The repository ships with a **GitHub Actions** pipeline defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml). It runs automatically on every `push` and `pull_request` targeting the `main` branch. All three jobs run sequentially — each one is gated on the previous, so a failure in lint short-circuits the rest of the pipeline.

### Pipeline overview

```
                       ┌─── PR or push to main ───┐
                       ▼                          ▼
┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────────┐
│   lint-and-audit     │─▶│       test       │─▶│    docker-build      │
│ eslint · prettier ·  │  │  jest (npm test) │  │ Dockerfile.dev +     │
│ tsc · npm audit      │  │                  │  │ Dockerfile.prod      │
└──────────────────────┘  └──────────────────┘  └──────────────────────┘
```

### Validation jobs (run on every PR and push)

1. **`lint-and-audit`** — installs deps with `npm ci`, then runs `npm run lint` (ESLint, strict TypeScript rules), `npm run format:check` (Prettier), `npm run type-check` (`tsc --noEmit` against `tsconfig.app.json`), and `npm audit --audit-level=high` to block on high-severity vulnerabilities.
2. **`test`** — installs deps and runs the full Jest suite via `npm test` (which uses `--runInBand` to keep tests deterministic with the in-memory store). Gated on `lint-and-audit`.
3. **`docker-build`** — matrix build of `Dockerfile.development` (tag `app:dev`) and `Dockerfile.production` (tag `app:prod`) via `docker/build-push-action` with `push: false`. The images are built end-to-end but never published, so the job catches Dockerfile regressions without needing a registry. Gated on `test`.

### Node version & strict engines

The Node version is pinned via [`.nvmrc`](.nvmrc) (currently `22`) and consumed by `actions/setup-node` in every job, so CI always uses the same runtime the project declares. [`.npmrc`](.npmrc) enables `engine-strict=true`, which makes `npm install` and `npm ci` honor the `engines` field in `package.json` both locally and in CI — incompatible Node versions fail fast instead of producing a half-installed tree.

### Where the build outputs live

| Output                                     | Location                                                |
| ------------------------------------------ | ------------------------------------------------------- |
| Validation logs (lint, format, type-check) | **Actions** tab on GitHub                               |
| `npm audit` report                         | **Actions** tab on GitHub                               |
| Jest test logs                             | **Actions** tab on GitHub                               |
| Built Docker images                        | Ephemeral, inside the runner (not pushed anywhere)      |
| Coverage report                            | Not produced in CI; run `npm run test:coverage` locally |

> **Note:** this pipeline is validation-only — there is no release job, no image push, and no version bump. To publish a Docker image, point the production `Dockerfile.production` at your registry and add a separate workflow that runs on tags.

### Running the same checks locally

```bash
# lint-and-audit
npm ci
npm run lint
npm run format:check
npm run type-check
npm audit --audit-level=high

# test
npm test

# docker-build
docker build -f Dockerfile.development -t app:dev .
docker build -f Dockerfile.production -t app:prod .
```

## Production

Pre-flight checklist before deploying:

1. [Testing](#testing) — full suite green.
2. [Security Audit](#security-audit) — `npm audit` clean (or known-safe).
3. [Build](#build) — production image builds successfully.

Once those pass, configure the runtime environment and distribute the image.

### Configure the environment for production

Whichever way you deploy, these are the values to set:

```bash
NODE_ENV=production
PORT=5050
```

- **With Docker:** `prod.docker-compose.yml` injects `.env` through `env_file`, so the values arrive as real environment variables.
- **Without Docker:** put them in `.env` (or `.env.production`) next to the process, or export them from your host, systemd unit, or hosting platform — real environment variables take precedence over any file.

See [Env Keys](#env-keys) for the full variable reference and [Environment files](#environment-files) for the resolution order.

### Distribute

Build and start the production stack with Docker:

```bash
docker-compose -f prod.docker-compose.yml up --build --force-recreate
```

Or run the compiled build directly on the host:

```bash
npm ci
npm run build
NODE_ENV=production npm start
```

## Known Issues

None at the moment.

## Other versions

This repository is the REST API with an in-memory store. Three specialized variants share the same architecture, tooling, and folder structure:

| Variant       | What it adds                                                                                                   | Repository                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **SQL**       | PostgreSQL via Prisma ORM, Docker Compose database services, migrations, and a Prisma-connected DAO layer      | [`node-express-sql-boilerplate`](https://github.com/DiegoLibonati/node-express-sql-boilerplate)           |
| **Socket.IO** | Socket.IO v4 with typed events, an in-memory store, and a sockets → services → store layer for real-time apps  | [`node-express-socketio-boilerplate`](https://github.com/DiegoLibonati/node-express-socketio-boilerplate) |
| **GraphQL**   | GraphQL endpoint at `/api/v1/graphql` (`graphql-http`), GraphiQL playground, and code-first schema + resolvers | [`node-express-graphql-boilerplate`](https://github.com/DiegoLibonati/node-express-graphql-boilerplate)   |

Pick the variant that matches the transport or persistence you need; everything else (layered architecture, Zod env, Pino, Helmet, Jest, Docker, CI) stays the same.

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/node-express-boilerplate`](https://www.diegolibonati.com.ar/#/project/node-express-boilerplate)
