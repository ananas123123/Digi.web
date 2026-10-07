# Digi Web

Digi Web is structured as a scalable web application rather than a single-page prototype.

## Architecture

- `src/app/` — application bootstrap and global lifecycle
- `src/components/` — reusable UI components
- `src/features/` — isolated product features; each feature owns its UI, logic, and supporting code
- `src/pages/` — page-level composition
- `src/services/` — external/API/data access
- `src/styles/` — global design system and shared styling
- `src/utils/` — small, reusable utilities
- `src/assets/` — static assets
- `tests/` — tests

## Development rule

Keep functionality modular. A feature should be removable without requiring unrelated features to be rewritten. Shared code belongs in shared layers; feature-specific code stays inside its feature.

This repository currently contains the structural foundation only. Product functionality and visual implementation are intentionally added incrementally.
