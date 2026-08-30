# SkillSphere AI

An AI-powered career navigation dashboard that helps learners connect skills, credentials, roadmaps, and opportunities.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/skillsphere-ai/src/App.tsx` — application shell, routes, pages, and learner interactions
- `artifacts/skillsphere-ai/src/index.css` — product theme, typography, motion, and responsive styling
- `artifacts/api-server/src/routes/skillsphere.ts` — dashboard, profile, skills, certificates, roadmap, and opportunities API
- `lib/api-spec/openapi.yaml` — source of truth for the generated API client and validation schemas
- `lib/db/src/schema/skillsphere.ts` — Drizzle tables and database insert schemas

## Architecture decisions

- The web app is the root artifact so the product opens directly in preview and in published deployments.
- The first experience uses a seeded learner journey so every primary screen is useful before account and external opportunity integrations are added.
- PostgreSQL with Drizzle is used for persistence because it is the workspace's managed database, while the API remains portable to other relational stores.
- OpenAPI drives both the server validation schemas and the React Query client to keep forms and mutations aligned.

## Product

- Learners can see a career overview with progress, skill gaps, activity, and target role.
- Skills and certificates can be added, edited, verified, or removed.
- A personalized roadmap exposes milestones and supports status updates.
- Opportunities can be searched and filtered by type, with match scores and relevant tags.
- Profile and career goal details can be edited from a dedicated profile view.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
