# BasePort: agentless control plane proposal

This is an architecture proposal illustrated by a frontend mock. There is no agent, API server, integration identity or production connector in this repository.

## Responsibilities

| Layer | Owns |
| --- | --- |
| BasePort | Service contracts, desired baselines, path versions, workflow state, evidence freshness and correlated records |
| DBRE | Playbooks, per-engine adapters, input schemas, tests, rollback and reporting mappings |
| giportal + AAP | Existing provisioning flow, VM/engine automation and job execution |
| ServiceNow | Authoritative change records and reviewer approvals |
| Rubrik / native tools | Configured backup/recovery execution and provider records |
| Native consoles / Grafana / Elastic | Detailed administration, diagnostics, monitoring and logs |

Developer and DBRE views are demo UX modes. Policy Servicing is the fictional developer team. This frontend does not implement authentication or authorization.

## A golden path

Publish a versioned contract containing service inputs, a pinned Git revision, approved per-engine AAP template mappings, preflight policy, a change template, approval routing, maintenance windows, rollback and an observation schema. The demo exposes editable AAP IDs and Git SHAs; production publishing would require validated adapters and reviewed tests. A pending run keeps its original binding even if a newer path is published.

BasePort populates the change request with service ownership, scope, impact, window and rollback. A human reviewer or an explicitly authorized standard-change policy approves it in ServiceNow. Creating a change never implies approval. Before dispatch, the production orchestrator must validate current approval, freshness, permissions and policy server-side. Backend adapters dispatch the approved job and correlate its outcome and observation callback. The POC uses explicit simulated reviewer actions.

## Make reporting a small addition to existing automation

Provide a reusable reporting role/task, JSON schema and a collector template. DBREs map engine-specific results to the canonical facts once per adapter, then reuse the contract across their jobs. Provisioning and lifecycle playbooks report after completion. A scheduled AAP inventory job reads native APIs or uses read-only engine queries to catch changes made outside BasePort. Backup and enterprise adapters independently query provider APIs. These jobs run in existing controller/execution environments; no resident agent is installed on VMs or databases.

The UI lets a DBRE edit and ingest this single-source observation locally:

```json
{
  "schemaVersion": "1.0",
  "serviceId": "DB-1023",
  "eventId": "unique-event-id",
  "sequence": 101,
  "observedAt": "2026-10-07T10:00:00Z",
  "source": "aap-inventory",
  "jobId": "AAP-501",
  "facts": {
    "tlsEnabled": true,
    "retentionDays": 14,
    "version": "19.22"
  }
}
```

A proposed production API is `POST /v1/observations`. The controller-side callback uses scoped workload identity/credentials; ingestion authenticates and authorizes the publisher for service IDs and allowed fields. Secrets and database content are excluded from observations. The demo does not authenticate a publisher: its source field only represents a configured binding.

## State accuracy

- Keep desired state separate from observed facts. The declared service version, TLS enabled, 14-day retention and recovery protection form this limited demo baseline.
- Require a stable service ID, schema version, source/job provenance and idempotency key.
- Reject duplicate events, older sequence numbers, regressing timestamps, invalid types and future timestamps. Preserve current evidence on rejection.
- Mark reports older than 30 minutes or missing reports **Unknown**. Unknown is not a compliance pass; execution requiring fresh evidence stays blocked.
- Configuration remediation cannot clear an unrelated recovery-policy gap.
- Production collectors should emit complete bounded snapshots, with a server-issued generation or source epoch for job/sequence resets. Maintain watermarks per service/source, define field authority and flag conflicting evidence rather than silently merging it.
- Use reliable callbacks with retries/dead-letter handling, plus periodic full reconciliation for missed callbacks, deletions and out-of-band changes. Preserve accepted and rejected evidence in an append-only history with retention.
- Surface freshness/coverage at service level. Leave CPU, query performance, alerts and logs in existing observability tools.

All examples are mock bindings, not claims about MetLife tooling coverage or actual compliance.
