# MCP Server on Azure Container Apps

Use the Bicep template to host the MCP stdio server inside Azure Container Apps. Pair it with an orchestrator pod or connect via `az containerapp exec`.

## Parameters
| Name | Description |
|------|-------------|
| `containerImage` | Image such as `homemindacr.azurecr.io/homemind-mcp:latest`. |
| `registryServer` | Login server used for pulls. |
| `apiBaseUrl` / `frontendBaseUrl` | homemind backend + frontend URLs. |
| `cacheTtlMs` / `cacheMax` | Cache tuning knobs. |
| `minReplicas` / `maxReplicas` | Scaling bounds (default 1). |
| `logAnalyticsWorkspaceId`, `logAnalyticsCustomerId`, `logAnalyticsSharedKey` | Diagnostics workspace references. |

## Deploy

```bash
az deployment group create \
  --resource-group homemind-rg \
  --template-file mcp/azure/containerapp.bicep \
  --parameters \
      containerImage="homemindacr.azurecr.io/homemind-mcp:latest" \
      registryServer="homemindacr.azurecr.io" \
      logAnalyticsWorkspaceId="/subscriptions/<sub>/resourceGroups/homemind-rg/providers/Microsoft.OperationalInsights/workspaces/homemind-law" \
      logAnalyticsCustomerId=$(az monitor log-analytics workspace show -g homemind-rg -n homemind-law --query customerId -o tsv) \
      logAnalyticsSharedKey=$(az monitor log-analytics workspace get-shared-keys -g homemind-rg -n homemind-law --query primarySharedKey -o tsv)
```

Grant `AcrPull` if needed:
```bash
az role assignment create \
  --assignee $(az containerapp show -g homemind-rg -n homemind-mcp --query identity.principalId -o tsv) \
  --role AcrPull \
  --scope $(az acr show -g homemind-rg -n homemindacr --query id -o tsv)
```

MCP runs on stdio; typically you exec into the container from a sibling Agentic AI container or external MCP client. Logs stream to Log Analytics.
