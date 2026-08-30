# SkillSphere AI

> A personalized career-navigation workspace that connects learner skills, credentials, roadmaps, opportunities, and progress.

SkillSphere AI helps learners understand where they are, identify the skills they need next, and turn career goals into an actionable plan. The MVP combines a polished dashboard with a PostgreSQL-backed API and a realistic seeded learner journey so the core experience is useful immediately.

## What it includes

- **Career dashboard** — progress overview, target role, skill gaps, recent activity, and next steps
- **Skills profile** — add, edit, verify, and remove skills with proficiency and evidence
- **Certificate tracking** — manage credentials and their verification status
- **Personalized roadmap** — review milestones and update progress through a career plan
- **Opportunity discovery** — filter opportunities by type, inspect match scores, and explore relevant tags
- **Profile and goals** — maintain learner details and career direction from a dedicated profile view

## Tech stack

- React, TypeScript, Vite, and Tailwind CSS
- Express 5 API server
- PostgreSQL with Drizzle ORM
- OpenAPI as the source of truth for API contracts
- Orval-generated React Query hooks and Zod validation schemas
- pnpm workspaces for the monorepo

## Repository structure

```text
artifacts/
├── skillsphere-ai/       # React web application
└── api-server/           # Express API and route handlers
lib/
├── api-client-react/     # Generated React Query client
├── api-spec/             # OpenAPI contract and code generation
├── api-zod/              # Generated request/response validation
└── db/                   # Drizzle schema and database utilities
```

## Getting started

### Prerequisites

- Node.js 24 or compatible
- pnpm
- PostgreSQL

### Install dependencies

```bash
pnpm install
```

### Configure the database

Set `DATABASE_URL` in your environment to a PostgreSQL connection string. Then apply the development schema:

```bash
pnpm --filter @workspace/db run push
```

### Start the API

```bash
pnpm --filter @workspace/api-server run dev
```

The API server runs on port `5000` in development.

### Start the web app

In a second terminal:

```bash
pnpm --filter @workspace/skillsphere-ai run dev
```

### Validate the workspace

```bash
pnpm run typecheck
pnpm run build
```

## API development

The OpenAPI document in `lib/api-spec/openapi.yaml` drives both server-side validation and the generated frontend client. After changing the contract, regenerate the client and validation schemas with:

```bash
pnpm --filter @workspace/api-spec run codegen
```

## Product status

SkillSphere AI is currently an MVP focused on the core learner journey. The seeded experience makes the dashboard and supporting flows explorable while the product foundation is prepared for authentication, richer recommendations, and external opportunity integrations.

## Contributing

1. Create a focused branch for your change.
2. Keep API contract changes in the OpenAPI specification first.
3. Run `pnpm run typecheck` and `pnpm run build` before opening a pull request.
4. Include a concise description of the user-facing impact and any database or API changes.
