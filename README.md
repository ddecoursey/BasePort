# BasePort — connected DBaaS for MetLife

BasePort is a frontend-only, MetLife-tailored proof of concept for a consistent database-as-a-service experience across the existing enterprise stack. Fictional policy, claims, finance, actuarial, group benefits and underwriting services illustrate the experience.

BasePort coordinates **service identity, ownership, policy, lifecycle workflows, contextual handoffs and correlated execution history**. It does not aim to improve on vendor-native administration or replace observability. Native consoles retain engine operations and diagnostics; Grafana and Elastic retain dashboards, alerts and logs; ServiceNow retains enterprise change/CMDB records; Git and Liquibase retain schema delivery.

Provisioning starts in **BasePort**, invokes the existing **giportal** flow, and routes VM/engine automation through **Ansible**. Backup and recovery use the service's configured provider: this demo illustrates **Rubrik** bindings for some services and platform-native bindings for others. Bindings do not assert actual MetLife coverage. A production workspace could launch from giportal with shared identity or be embedded there; this standalone website demonstrates the service experience.

The visual design uses MetLife's published primary colors (white, #0090DA, #007ABC, #0061A0 and #A4CE4E) and the published #278280–#0061A0 gradient. MetLife is identified in the workspace selector; no MetLife logo is used. Sources: [Color guidance](https://design.metlife.com/foundations/standards/color/) and [Graphics guidance](https://design.metlife.com/foundations/core-guidance/graphics/). The palette and restrained gradient are adopted; this POC does not claim full design-system certification.

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

- **Overview:** database estate, backup and version posture, operational work, and a connected-stack value proposition.
- **Request a service:** mocked specification, production change-reference guard, five-step BasePort → ServiceNow → giportal → Ansible → inventory route, and request/workflow/job correlation IDs. New services require protection configuration.
- **Connected tools:** ownership map and contextual handoff previews for provisioning, governance, recovery, native consoles, delivery and observability. No external enterprise URLs are configured.
- **Service insights:** derived estate-level ownership coverage, protection gaps, delivery queue, platform distribution and declared storage entitlement. No CPU, engine telemetry or diagnostic dashboards.
- **Database inventory:** Oracle, SQL Server, Db2, PostgreSQL, MongoDB, and Cloudera; filter by platform/environment/team; export CSV; inspect ownership, version, declared entitlement, recovery provider, tool bindings and giportal references.
- **Lifecycle operations:** preflight, change context, maintenance windows, scheduling, simulated execution, restart, patch, upgrade, and retirement.
- **Backup & recovery:** on-demand backups, verification metadata, retention, and recovery rehearsal via isolated development clones. Sources remain unchanged; clones need their own protection policy.
- **Migrations:** same-platform mock transfers into staging, source backup prerequisites, reconciliation results, and migration history. Cross-engine work is shown as an assessment requiring schema mapping and reviewed cutover planning, not as an automatic supported conversion.
- **Liquibase changes:** mock repository binding, per-database changeset status, PostgreSQL statement previews, validation, production approval, update, and defined rollback. Other relational engines show adapter-specific preview placeholders; real engine SQL must be generated and reviewed. MongoDB needs extension-specific configuration; Cloudera dataset workflows need platform-native integration.
- **Audit & activity:** action, database, actor, change reference, status, and outcome in one activity trail.
- **giportal handoff:** simulated registration of an already provisioned service with its source reference.

All state is in memory and resets on reload. All connection endpoints, versions, checks, approvals, backups, metrics, SQL execution, integrations, and operations are illustrative. No actual infrastructure is provisioned or managed. All browser tests operate on mock state only.

## Binaya's manager demo

Share `https://ddecoursey.github.io/BasePort/?demo=binaya` for the nine-step guided demo. It explains why a cross-stack service layer is useful, how existing tools retain their roles, and how inventory, configured recovery, maintenance, migration and Liquibase fit together. It supports platform choice, Back, Replay, and Escape. Demo changes are isolated and the original records are restored on exit. The normal sidebar also offers **Guided manager demo**.

## Validation

With the local development server running:

```sh
npm run test:dbaas
npm run test:demo
npm run test:stack
```

The DBaaS smoke test checks meaningful state transitions and guardrails: production change references, verified restore points, clone registration, preflight failure, scheduling/execution, version updates, migration validation, database-scoped Liquibase state and rollback, unsupported capabilities, retirement, handoff, and audit records. The manager demo test runs on desktop and mobile, checks keyboard focus and platform selection, and verifies demo cleanup preserves existing backups. The connected-stack test checks production request validation, route progression, correlation IDs, service registration, provider bindings, contextual tool handoffs, service insights and mobile overflow.

Tests use `/usr/bin/chromium` in the cloud environment. The manager test falls back to Playwright's installed Chromium elsewhere. Set `DEMO_TEST_URL` to use another local server.

## GitHub Pages

`.github/workflows/deploy-pages.yml` builds the static production frontend after pushes to `main` or a manual workflow dispatch. Relative asset URLs support repository subpaths.

Use **Settings → Pages → Source → GitHub Actions** for workflow-based publishing. The currently available GitHub integration can deploy a Pages artifact but cannot change that administrative setting. If legacy branch publishing is still configured, it also triggers a source build; cancel the source build for the same commit before deploying the built artifact to prevent it replacing the frontend with raw source.

Site: `https://ddecoursey.github.io/BasePort/`. No custom deployment secrets or application API keys are required.
