---
name: API codegen compatibility
description: Orval's current Zod generator can emit APIs unavailable in the workspace's pinned Zod 3 runtime.
---

When adding integer-like values to the OpenAPI contract, confirm the generated Zod output matches the workspace's installed Zod major version; prefer a compatible numeric schema or intentionally upgrade the shared dependency.

**Why:** The generator emitted `z.int()` while the workspace was pinned to Zod 3, causing the generated library typecheck to fail even though codegen itself succeeded.

**How to apply:** Run API codegen plus the chained library typecheck immediately after contract changes, before using the generated hooks in an artifact.