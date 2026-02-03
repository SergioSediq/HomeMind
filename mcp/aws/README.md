# MCP Server on AWS ECS

Use this CloudFormation template to run the homemind MCP server as a managed ECS Fargate service.

## Parameters

| Parameter | Description |
|-----------|-------------|
| `ClusterName` | Existing ECS cluster. |
| `ExecutionRoleArn` | ECS task execution role. |
| `ContainerImage` | MCP container image (e.g., `ghcr.io/your-org/homemind-mcp:latest`). |
| `SubnetIds` | Private subnet IDs. |
| `SecurityGroupIds` | Security groups allowing outbound access to the backend API. |
| `ApiBaseUrl` | homemind backend API base URL. |
| `FrontendBaseUrl` | Frontend base URL used for map links. |
| `CacheTtlMs` / `CacheMax` | Cache controls. |

## Deploy

```bash
aws cloudformation deploy \
  --template-file mcp/aws/ecs-service.yaml \
  --stack-name homemind-mcp \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    ClusterName=homemind-ecs-cluster \
    ExecutionRoleArn=arn:aws:iam::123:role/homemind-ecs-execution-role \
    ContainerImage=ghcr.io/your-org/homemind-mcp:latest \
    SubnetIds=subnet-aaa,subnet-bbb \
    SecurityGroupIds=sg-abc123
```

This service listens on STDIN/STDOUT; pair it with the Agentic AI service, or use `ecs exec` to attach an MCP client process.
