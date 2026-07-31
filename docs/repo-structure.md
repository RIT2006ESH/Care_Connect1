# Repository Structure

This repository currently contains multiple projects. The intended standard layout is:

```text
Care-Connect/
├─ apps/
│  └─ frontend/
├─ services/
│  ├─ ml-backend/
│  └─ health-notices/
├─ third-party/
│  └─ mirotalkc2c-main/
├─ docs/
├─ frontend/                # legacy location until migration is complete
├─ ml_backend/              # legacy location until migration is complete
├─ health notices/          # legacy location until migration is complete
└─ README.md
```

## Current Working Set

- `frontend/` contains the React application.
- `ml_backend/` contains the disease prediction Flask API.
- `health notices/` contains the weather-based health notices Flask app.
- `mirotalkc2c-main/` is a separate third-party project and should stay isolated from the Care Connect codebase.

## Cleanup Rules

- Keep generated output out of git: `node_modules`, `build`, `venv`, `.venv`, `__pycache__`.
- Keep environment files local: `.env` and `.env.*`.
- Prefer hyphenated folder names for service boundaries.
- Move unrelated external projects into `third-party/`.

## Migration Target

When the shell bridge is available again, migrate the legacy folders into:

- `apps/frontend`
- `services/ml-backend`
- `services/health-notices`
- `third-party/mirotalkc2c-main`
