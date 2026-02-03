# GitLab CI/CD for homemind

This repo now ships with a GitLab pipeline (`.gitlab-ci.yml`) and a deploy helper (`gitlab/deploy.sh`) that wrap the existing Kubernetes scripts for blue/green, canary, and rolling deployments.

## Pipeline stages

1. **lint** â€“ Frontend lint (`npm run lint --prefix frontend`).
2. **test** â€“ Backend and frontend Jest runs (serial to reduce flakiness).
3. **build** â€“ TypeScript build for backend and Next.js build for frontend.
4. **security** â€“ `npm audit --audit-level=high` on backend and frontend.
5. **deploy** â€“ Manual, strategy-specific deploy jobs.

> The pipeline uses `node:20` and caches `~/.npm` in project-local `.npm`.

## Required CI variables

Set these in GitLab project or group settings:

- `KUBECONFIG` â€“ Base64-encoded kubeconfig or inject via `K8S_SERVICE_ACCOUNT` integration.
- `IMAGE_TAG` â€“ Container image (e.g., `ghcr.io/your-org/homemind-app-backend:v1.2.3`).
- `SERVICE_NAME` â€“ Kubernetes service name (default `backend`).
- `NAMESPACE` â€“ Target namespace (default `homemind`).
- `DEPLOY_STRATEGY` â€“ `blue-green`, `canary`, or `rolling` (set per environment or manual job variable).
- Optional toggles:
  - Blue/Green: `AUTO_SWITCH`, `SMOKE_TEST`, `SCALE_DOWN_OLD` (all default `false`).
  - Canary: `CANARY_STAGES` (e.g., `10,25,50,75,100`), `STAGE_DURATION`, `AUTO_PROMOTE`, `ENABLE_METRICS`, `CANARY_REPLICAS_START`, `STABLE_REPLICAS`.

## Deploy helper

`gitlab/deploy.sh` invokes:

- `kubernetes/scripts/blue-green-deploy.sh` (blue/green)
- `kubernetes/scripts/canary-deploy.sh` (canary)
- `kubectl rollout restart` (rolling)

It respects the environment variables above and runs from the repo root, so manifest-relative paths continue to work.

## Usage

1. Push to a branch; the pipeline runs lint, tests, build, and security.
2. Merge to `main`.
3. Trigger the desired deploy job (manual) with `DEPLOY_STRATEGY` and `IMAGE_TAG` set.
4. Monitor rollout via pipeline logs or `deployment-control/` dashboard.

## Prod readiness tips

- Use GitLab protected variables and protected branches/tags for production deploys.
- Add a GitLab Kubernetes cluster integration to avoid storing kubeconfig as a file.
- For canary metrics, set `ENABLE_METRICS=true` and extend `check_canary_metrics` to query Prometheus.
- Enable merge request approvals and status checks on `lint`, `test`, and `security-audit` jobs.
