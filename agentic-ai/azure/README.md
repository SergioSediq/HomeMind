# Agentic AI on Azure Container Apps

Deploy the Agentic AI orchestrator to Azure Container Apps using the provided Bicep module.

## Prerequisites
- Azure CLI `>=2.49`
- Existing Container Apps environment + Log Analytics workspace
- Container image pushed to ACR (e.g., `ghcr.io/your-org/homemind-agentic:latest` or imported into ACR)

## Parameters

| Parameter | Description |
|-----------|-------------|
| `containerImage` | Full image reference (`registry.azurecr.io/repo:tag`). |
| `registryServer` | Container registry login server (e.g., `homemindacr.azurecr.io`). |
| `registryIdentity` | `system` for managed identity pull or client secret identity. |
| `googleAiApiKey` / `openAiApiKey` / `pineconeApiKey` | Optional secrets injected as environment variables. |
| `pineconeIndex` | Pinecone index name. |
| `neo4jUri`, `neo4jUser`, `neo4jPassword` | Optional Neo4j settings. |
| `agentRuntime` | `default`, `langgraph`, or `crewai`. |
| `logAnalyticsWorkspaceId` | Resource ID of Log Analytics workspace. |
| `logAnalyticsCustomerId`, `logAnalyticsSharedKey` | Workspace credentials for diagnostics. |

## Deploy

```bash
az deployment group create \
  --resource-group homemind-rg \
  --template-file agentic-ai/azure/containerapp.bicep \
  --parameters \
      containerImage="homemindacr.azurecr.io/homemind-agentic:latest" \
      registryServer="homemindacr.azurecr.io" \
      logAnalyticsWorkspaceId="/subscriptions/<sub>/resourceGroups/homemind-rg/providers/Microsoft.OperationalInsights/workspaces/homemind-law" \
      logAnalyticsCustomerId=$(az monitor log-analytics workspace show -g homemind-rg -n homemind-law --query customerId -o tsv) \
      logAnalyticsSharedKey=$(az monitor log-analytics workspace get-shared-keys -g homemind-rg -n homemind-law --query primarySharedKey -o tsv)
```

Grant the container app identity `AcrPull` on the registry if needed:

```bash
az role assignment create \
  --assignee $(az containerapp show -g homemind-rg -n homemind-agentic-ai --query identity.principalId -o tsv) \
  --role AcrPull \
  --scope $(az acr show -g homemind-rg -n homemindacr --query id -o tsv)
```

Scale replicas via:
```bash
az containerapp update -g homemind-rg -n homemind-agentic-ai --set-scale min-replicas 1 --set-scale max-replicas 5
```
