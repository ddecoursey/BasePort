# BasePort — DBaaS management workspace

BasePort is a frontend-only proof of concept for database-as-a-service management within the existing **giportal** ecosystem.

**giportal remains the infrastructure entry point:** service requests, VM and database provisioning, and enterprise workflows. **BasePort adds database management depth:** inventory, backup and recovery, restart, patch, upgrade, retirement, migration, Liquibase change delivery, and operational history. A production implementation could be embedded in giportal or linked as a specialist workspace with shared enterprise identity. This standalone website is a design preview, not a working giportal integration.

## Run and build

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev -- --port 3000
```

```sh
npm run build
npm run preview
```

## Workflows

- **Overview:** database estate, backup and version posture, operational work, and an explicit giportal/BasePort relationship.
- **Database inventory:** Oracle, SQL Server, Db2, PostgreSQL, MongoDB, and Cloudera; filter by platform/environment/team; export CSV; inspect ownership, version, resource allocation, and giportal references.
- **Lifecycle operations:** preflight, change context, maintenance windows, scheduling, simulated execution, restart, patch, upgrade, and retirement.
- **Backup & recovery:** on-demand backups, verification metadata, retention, and recovery rehearsal via isolated development clones. Sources remain unchanged; clones need their own protection policy.
- **Migrations:** same-platform mock transfers into staging, source backup prerequisites, reconciliation results, and migration history. Cross-engine work is shown as an assessment requiring schema mapping and reviewed cutover planning, not as an automatic supported conversion.
- **Liquibase changes:** mock repository binding, per-database changeset status, PostgreSQL statement previews, validation, production approval, update, and defined rollback. Other relational engines show adapter-specific preview placeholders; real engine SQL must be generated and reviewed. MongoDB needs extension-specific configuration; Cloudera dataset workflows need platform-native integration.
- **Audit & activity:** action, database, actor, change reference, status, and outcome in one activity trail.
- **giportal handoff:** simulated registration of an already provisioned service with its source reference.

All state is in memory and resets on reload. All connection endpoints, versions, checks, approvals, backups, metrics, SQL execution, integrations, and operations are illustrative. No actual infrastructure is provisioned or managed. All browser tests operate on mock state only.

## Binaya's manager demo

Share `https://ddecoursey.github.io/BasePort/?demo=binaya` for the nine-step guided demo. It explains the role beside giportal, inventory, recovery, maintenance, migration, Liquibase delivery, and management value. It supports platform choice, Back, Replay, and Escape. Demo changes are isolated and the original records are restored on exit. The normal sidebar also offers **Guided manager demo**.

## Validation

With the local development server running:

```sh
npm run test:dbaas
npm run test:demo
```

The DBaaS smoke test checks meaningful state transitions and guardrails: production change references, verified restore points, clone registration, preflight failure, scheduling/execution, version updates, migration validation, database-scoped Liquibase state and rollback, unsupported capabilities, retirement, handoff, and audit records. The manager demo test runs on desktop and mobile, checks keyboard focus and platform selection, and verifies demo cleanup preserves existing backups.

Tests use `/usr/bin/chromium` in the cloud environment. The manager test falls back to Playwright's installed Chromium elsewhere. Set `DEMO_TEST_URL` to use another local server.

## GitHub Pages

`.github/workflows/deploy-pages.yml` builds the static production frontend after pushes to `main` or a manual workflow dispatch. Relative asset URLs support repository subpaths.

Use **Settings → Pages → Source → GitHub Actions** for workflow-based publishing. The currently available GitHub integration can deploy a Pages artifact but cannot change that administrative setting. If legacy branch publishing is still configured, it also triggers a source build; cancel the source build for the same commit before deploying the built artifact to prevent it replacing the frontend with raw source.

Site: `https://ddecoursey.github.io/BasePort/`. No custom deployment secrets or application API keys are required.
