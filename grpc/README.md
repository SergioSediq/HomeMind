# homemind gRPC Market Pulse Service

High-performance gRPC service exposing homemind market intelligence for partner integrations and data science workflows. It mirrors the Market Pulse logic from the web UI but runs independently.

## Architecture

```mermaid
flowchart LR
  Client[Partner / DS Client] --> GRPC[gRPC Server]
  GRPC --> Data[Curated Market Datasets]
  GRPC --> Rules[Scoring + Heuristics]
  GRPC --> Logs[(Structured Logs)]
```

## Core RPCs

- **GetSnapshot** (unary): Returns market summary, metrics, and recommendations.
- **StreamHotZips** (server streaming): Emits ZIP opportunities filtered by yield.
- **ListMarkets** (unary): Lists available metros and known aliases.

## Project Structure

```
grpc/
â”œâ”€â”€ proto/market_pulse.proto      # gRPC contract
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ config/                   # Env loading + defaults
â”‚   â”œâ”€â”€ data/                     # Curated datasets
â”‚   â”œâ”€â”€ services/                 # Business logic + handlers
â”‚   â””â”€â”€ utils/                    # Helpers
â”œâ”€â”€ aws | azure | gcp             # Cloud deployment templates
â”œâ”€â”€ Dockerfile
â”œâ”€â”€ docker-compose.yml
â””â”€â”€ README.md
```

## Quickstart

```bash
cd grpc
npm install
npm run dev        # Starts the service on :50051

# In another terminal
grpcurl -plaintext -d '{"query":"Austin, TX"}' \
  localhost:50051 homemind.marketpulse.MarketPulseService/GetSnapshot
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `GRPC_HOST` | `0.0.0.0` | Bind address. |
| `GRPC_PORT` | `50051` | Listen port. |
| `LOG_LEVEL` | `info` | Log level. |

Create a `.env` file in `grpc/` to override defaults.

## Deployment

- **Docker**:
  ```bash
  docker build -t homemind/market-pulse-grpc .
  docker run -p 50051:50051 homemind/market-pulse-grpc
  ```
- **AWS ECS**: see `grpc/aws/README.md`.
- **Azure Container Apps**: see `grpc/azure/README.md`.
- **Google Cloud Run**: see `grpc/gcp/README.md`.

## Contract Notes

- The canonical contract is `proto/market_pulse.proto`.
- Regenerate client stubs when the proto changes.
- Keep backward compatibility for partner integrations (avoid breaking field changes).

## Testing and CI

- `npm test` runs unit tests (dataset resolution, scoring rules).
- `npm run lint` runs ESLint.
- `npm run proto:check` runs `buf lint` over the proto.

## Roadmap Ideas

- SDK generation via `buf` plugins (TypeScript, Go, Python).
- Publish snapshots to analytics storage (S3 or BigQuery).
- Add auth interceptors (mTLS / API keys) for partner traffic.
