# Production Operations Runbook

## Table of Contents

- [Daily Operations](#daily-operations)
  - [Morning Checks](#morning-checks)
  - [Weekly Tasks](#weekly-tasks)
- [Deployment Procedures](#deployment-procedures)
  - [Standard Deployment](#standard-deployment)
  - [Blue-Green Deployment](#blue-green-deployment)
  - [Canary Deployment](#canary-deployment)
- [Scaling Operations](#scaling-operations)
  - [Manual Scaling](#manual-scaling)
  - [Adjust HPA](#adjust-hpa)
- [Database Operations](#database-operations)
  - [Manual Backup](#manual-backup)
  - [Restore from Backup](#restore-from-backup)
  - [Run Database Migration](#run-database-migration)
- [Security Operations](#security-operations)
  - [Rotate Secrets](#rotate-secrets)
  - [Update TLS Certificates](#update-tls-certificates)
- [Monitoring and Alerting](#monitoring-and-alerting)
  - [Check Alert Status](#check-alert-status)
  - [Custom Metrics Query](#custom-metrics-query)
- [Troubleshooting Quick Reference](#troubleshooting-quick-reference)
  - [Pod Stuck in Pending](#pod-stuck-in-pending)
  - [Pod CrashLoopBackOff](#pod-crashloopbackoff)
  - [High Memory Usage](#high-memory-usage)
  - [Network Issues](#network-issues)
- [Maintenance Windows](#maintenance-windows)
  - [Scheduled Maintenance Procedure](#scheduled-maintenance-procedure)
- [Emergency Procedures](#emergency-procedures)
  - [Emergency Rollback](#emergency-rollback)
  - [Emergency Scale Down](#emergency-scale-down)
  - [Circuit Breaker](#circuit-breaker)
- [On-Call Cheat Sheet](#on-call-cheat-sheet)

## Daily Operations

### Morning Checks

```bash
#!/bin/bash
# Daily health check script

echo "=== homemind Daily Health Check ==="

# 1. Check all pods are running
echo "Pod Status:"
kubectl get pods -n homemind

# 2. Check HPA status
echo -e "\nHPA Status:"
kubectl get hpa -n homemind

# 3. Check recent deployments
echo -e "\nRecent Deployments (last 24h):"
kubectl get events -n homemind --field-selector type=Normal | grep -i deploy | head -10

# 4. Check error rate (last 1 hour)
echo -e "\nError Count (last hour):"
kubectl logs -l app=homemind-backend -n homemind --since=1h | grep -c ERROR || echo "0"

# 5. Check resource usage
echo -e "\nResource Usage:"
kubectl top pods -n homemind

# 6. Check PDB status
echo -e "\nPod Disruption Budgets:"
kubectl get pdb -n homemind

echo -e "\n=== Health Check Complete ==="
```

### Weekly Tasks

1. **Review Monitoring Dashboards**
   - Check Grafana for trends
   - Review alert history
   - Identify performance patterns

2. **Backup Verification**
   ```bash
   # Check backup jobs
   kubectl get cronjob -n homemind

   # Verify latest backup
   kubectl logs -l app=mongodb-backup -n homemind --tail=100

   # List backups in S3
   aws s3 ls s3://your-bucket/mongodb-backups/
   ```

3. **Security Scans**
   ```bash
   # Run manual security scan
   trivy image ghcr.io/your-org/homemind-app-backend:latest

   # Check for outdated dependencies
   npm audit --prefix backend
   npm audit --prefix frontend
   ```

4. **Capacity Planning**
   ```bash
   # Check resource trends
   kubectl top nodes
   kubectl top pods -n homemind --sort-by=memory

   # Review HPA metrics
   kubectl get hpa -n homemind -o yaml
   ```

---

## Deployment Procedures

### Standard Deployment

```bash
# 1. Pre-deployment checks
kubectl get pods -n homemind
kubectl get hpa -n homemind

# 2. Deploy new version
kubectl set image deployment/homemind-backend \
  backend=ghcr.io/your-org/homemind-app-backend:v1.2.3 \
  -n homemind

# 3. Monitor rollout
kubectl rollout status deployment/homemind-backend -n homemind

# 4. Verify deployment
kubectl get pods -n homemind
kubectl logs -f deployment/homemind-backend -n homemind

# 5. Check error rate
sleep 60
kubectl logs -l app=homemind-backend -n homemind --since=1m | grep -c ERROR
```

### Blue-Green Deployment

```bash
# Using deployment script
export NAMESPACE=homemind
export AUTO_SWITCH=false
export SMOKE_TEST=true

./kubernetes/scripts/blue-green-deploy.sh backend \
  ghcr.io/your-org/homemind-app-backend:v1.2.3
```

### Canary Deployment

```bash
# Using deployment script
export NAMESPACE=homemind
export CANARY_STAGES=10,25,50,75,100
export STAGE_DURATION=180
export AUTO_PROMOTE=false

./kubernetes/scripts/canary-deploy.sh backend \
  ghcr.io/your-org/homemind-app-backend:v1.2.3
```

---

## Scaling Operations

### Manual Scaling

```bash
# Scale up
kubectl scale deployment/homemind-backend --replicas=5 -n homemind

# Scale down
kubectl scale deployment/homemind-backend --replicas=2 -n homemind

# Verify
kubectl get deployment homemind-backend -n homemind
```

### Adjust HPA

```bash
# Edit HPA
kubectl edit hpa homemind-backend-hpa -n homemind

# Or patch directly
kubectl patch hpa homemind-backend-hpa -n homemind \
  -p '{"spec":{"maxReplicas":15}}'

# Verify
kubectl describe hpa homemind-backend-hpa -n homemind
```

---

## Database Operations

### Manual Backup

```bash
# Trigger manual backup job
kubectl create job --from=cronjob/mongodb-backup \
  mongodb-backup-manual-$(date +%Y%m%d-%H%M%S) \
  -n homemind

# Monitor backup
kubectl logs -f job/mongodb-backup-manual-YYYYMMDD-HHMMSS -n homemind
```

### Restore from Backup

```bash
# 1. Scale down backend
kubectl scale deployment/homemind-backend --replicas=0 -n homemind

# 2. Download backup
aws s3 cp s3://your-bucket/mongodb-backups/mongodb_backup_YYYYMMDD_HHMMSS.archive ./

# 3. Restore
kubectl run mongodb-restore --rm -it \
  --image=mongo:7.0 \
  --command -n homemind -- \
  mongorestore --uri="$MONGO_URI" --archive=mongodb_backup_YYYYMMDD_HHMMSS.archive --gzip

# 4. Scale up backend
kubectl scale deployment/homemind-backend --replicas=2 -n homemind
```

### Run Database Migration

```bash
# Apply migration job
kubectl apply -f kubernetes/jobs/db-migration-job.yaml

# Monitor migration
kubectl logs -f job/db-migration -n homemind

# Verify completion
kubectl get job db-migration -n homemind
```

---

## Security Operations

### Rotate Secrets

```bash
# 1. Create new secret
kubectl create secret generic homemind-secrets-new \
  --from-literal=mongoUri="mongodb://..." \
  --from-literal=jwtSecret="new-secret-$(openssl rand -base64 32)" \
  --from-literal=googleAiApiKey="..." \
  --from-literal=pineconeApiKey="..." \
  --from-literal=pineconeIndex="..." \
  -n homemind

# 2. Update deployment to use new secret
kubectl set env deployment/homemind-backend \
  --from=secret/homemind-secrets-new \
  -n homemind

# 3. Trigger rolling restart
kubectl rollout restart deployment/homemind-backend -n homemind

# 4. Verify
kubectl rollout status deployment/homemind-backend -n homemind

# 5. Delete old secret
kubectl delete secret homemind-secrets -n homemind

# 6. Rename new secret
kubectl get secret homemind-secrets-new -n homemind -o yaml | \
  sed 's/homemind-secrets-new/homemind-secrets/' | \
  kubectl apply -f -
```

### Update TLS Certificates

```bash
# Using cert-manager (automatic)
kubectl get certificate -n homemind

# Manual certificate update
kubectl create secret tls homemind-tls-new \
  --cert=path/to/cert.crt \
  --key=path/to/cert.key \
  -n homemind

kubectl patch ingress homemind-ingress -n homemind \
  -p '{"spec":{"tls":[{"secretName":"homemind-tls-new","hosts":["homemind.example.com"]}]}}'
```

---

## Monitoring and Alerting

### Check Alert Status

```bash
# View active alerts in Prometheus
# Access Prometheus UI at http://prometheus.example.com/alerts

# View alert rules
kubectl get prometheusrule -n homemind -o yaml

# Silence alert
# Use Alertmanager UI or CLI
```

### Custom Metrics Query

```bash
# Port forward to Prometheus
kubectl port-forward -n monitoring svc/prometheus 9090:9090

# Query examples:
# - Request rate: rate(http_requests_total{namespace="homemind"}[5m])
# - Error rate: rate(http_request_errors_total{namespace="homemind"}[5m])
# - P95 latency: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

---

## Troubleshooting Quick Reference

### Pod Stuck in Pending

```bash
kubectl describe pod <pod-name> -n homemind | grep -A 10 Events
kubectl get nodes -o json | jq '.items[].status.allocatable'
```

### Pod CrashLoopBackOff

```bash
kubectl logs <pod-name> -n homemind --previous
kubectl describe pod <pod-name> -n homemind
```

### High Memory Usage

```bash
kubectl top pods -n homemind --sort-by=memory
kubectl exec -it <pod-name> -n homemind -- top -o %MEM
```

### Network Issues

```bash
# Test connectivity from pod
kubectl exec -it <pod-name> -n homemind -- ping mongodb
kubectl exec -it <pod-name> -n homemind -- curl -v http://homemind-backend:3001/health

# Check network policies
kubectl get networkpolicy -n homemind
kubectl describe networkpolicy <policy-name> -n homemind
```

---

## Maintenance Windows

### Scheduled Maintenance Procedure

```bash
# 1. Notify users (30 min before)
# Send notification through communication channels

# 2. Enable maintenance mode (if supported)
kubectl set env deployment/homemind-backend MAINTENANCE_MODE=true -n homemind

# 3. Perform maintenance tasks
# - Apply updates
# - Run database migrations
# - Update configurations

# 4. Verify services
kubectl get pods -n homemind
curl https://homemind.example.com/health

# 5. Disable maintenance mode
kubectl set env deployment/homemind-backend MAINTENANCE_MODE- -n homemind

# 6. Monitor for issues
kubectl logs -f deployment/homemind-backend -n homemind
```

---

## Emergency Procedures

### Emergency Rollback

```bash
# Immediate rollback
kubectl rollout undo deployment/homemind-backend -n homemind

# Rollback to specific revision
kubectl rollout history deployment/homemind-backend -n homemind
kubectl rollout undo deployment/homemind-backend --to-revision=N -n homemind
```

### Emergency Scale Down

```bash
# Reduce load during incident
kubectl scale deployment/homemind-backend --replicas=1 -n homemind
kubectl scale deployment/homemind-frontend --replicas=1 -n homemind
```

### Circuit Breaker

```bash
# Disable specific features via ConfigMap
kubectl patch configmap homemind-shared-config -n homemind \
  -p '{"data":{"FEATURE_AI_ENABLED":"false"}}'

kubectl rollout restart deployment/homemind-backend -n homemind
```

---

## On-Call Cheat Sheet

```bash
# Quick status check
alias estate-status='kubectl get pods,hpa,pdb,svc -n homemind'

# Quick logs
alias estate-logs='kubectl logs -f -l app=homemind-backend -n homemind --max-log-requests=10'

# Quick metrics
alias estate-metrics='kubectl top pods -n homemind'

# Quick rollback
alias estate-rollback='kubectl rollout undo deployment/homemind-backend -n homemind'
```

---

**Contact Information:**
- Primary On-Call: [PagerDuty/Phone]
- Secondary On-Call: [PagerDuty/Phone]
- Engineering Manager: [Contact]
- Slack Channel: #homemind-incidents
