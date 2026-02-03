# Azure Container Apps Deployment

The `container-app.bicep` template provisions an Azure Container App environment ready to run the homemind Market Pulse gRPC service.

## Prerequisites

- Azure CLI logged in (`az login`).
- Resource group created (e.g., `homemind-grpc-rg`).
- Container image published to Azure Container Registry (ACR).

## Deploy

```bash
az deployment group create \
  --resource-group homemind-grpc-rg \
  --template-file container-app.bicep \
  --parameters \
      containerImage=homemind.azurecr.io/market-pulse-grpc:latest \
      environmentName=homemind-env \
      containerAppName=market-pulse-grpc \
      logLevel=info
```

The template exposes the gRPC endpoint internally on port `50051`. Enable ingress or Azure Front Door as required for public access.
