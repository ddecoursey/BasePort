# BasePort — lightweight DBaaS control plane

BasePort is a frontend-only, MetLife-tailored proof of concept for a consistent database-as-a-service experience across the existing enterprise stack. Fictional policy, claims, finance, actuarial, group benefits and underwriting services illustrate the experience.

BasePort coordinates **service identity, ownership, policy, lifecycle workflows, contextual handoffs and correlated execution history**. It does not aim to improve on vendor-native administration or replace observability. Native consoles retain engine operations and diagnostics; Grafana and Elastic retain dashboards, alerts and logs; ServiceNow retains enterprise change/CMDB records; Git and Liquibase retain schema delivery.

Provisioning starts in **BasePort**, invokes the existing **giportal** flow, and routes VM/engine automation through **Ansible**. Backup and recovery use the service's configured provider: this demo illustrates **Rubrik** bindings for some services and platform-native bindings for others. Bindings do not assert actual MetLife coverage. A production workspace could launch from giportal with shared identity or be embedded there; this standalone website demonstrates the service experience.

The custom BasePort mark uses a folded gateway, an open aperture and a grounded base to represent a service control plane across execution layers. Its canopy uses Gradient 6. A dedicated favicon and a monochrome SVG are included in `public/`. The visual design uses MetLife's published primary colors (white, #0090DA, #007ABC, #0061A0 and #A4CE4E) and the published Gradient 6 (#A4CE4E–#0090DA). MetLife is identified in the workspace selector; no MetLife logo is used. Sources: [Color guidance](https://design.metlife.com/foundations/standards/color/) and [Graphics guidance](https://design.metlife.com/foundations/core-guidance/graphics/). The palette and restrained gradient are adopted; this POC does not claim full design-system certification.

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

## Experiences

- **Developer:** a concise team workspace, owned services, approved service requests, recovery and schema delivery. Demo team: Policy Servicing.
- **DBRE:** estate inventory, versioned golden paths, policy/drift, agentless evidence, lifecycle work and service insights. Use `?view=dbre` to open this view.
- **Golden paths:** edit a mock AAP template and pinned Git SHA; publish a revision. Pending runs preserve their original binding.
- **Governed runs:** generate a change record, wait for an explicit simulated reviewer, execute the approved path, and reconcile evidence. Pending baseline runs survive closing the dialog.
- **Policy & drift:** compare desired TLS, retention and declared version with fresh observed facts. Missing/stale reports become Unknown; recovery protection is checked separately.
- **Agentless sync:** a small JSON contract for existing AAP jobs, pipeline callbacks and scheduled read-only reconciliation. Try fresh facts, drift, duplicate and older reports. No resident VM/database agent or working backend is included.
- **Existing workflows:** provider-aware backups, isolated restore clones, migration assessments, relational Liquibase demos and contextual tool handoffs remain available.

See [the agentless control plane proposal](docs/agentless-control-plane.md) for the ownership model, reporting contract, production trust boundaries and reconciliation design. Persona switching demonstrates UX, not production access control.

All state is in memory and resets on reload. All connection endpoints, versions, checks, approvals, backups, metrics, SQL execution, integrations, and operations are illustrative. No actual infrastructure is provisioned or managed. All browser tests operate on mock state only.

## Binaya's manager demo

Share `https://ddecoursey.github.io/BasePort/?demo=binaya` for the nine-step guided demo. It explains the two views, golden paths, drift, agentless reporting, automated paperwork and existing execution layers. It supports platform choice, Back, Replay, and Escape. Demo changes are isolated and the original records are restored on exit. The normal sidebar also offers **Guided manager demo**.

## Validation

With the local development server running:

```sh
npm run test:dbaas
npm run test:demo
npm run test:stack
npm run test:control
```

The DBaaS smoke test checks meaningful state transitions and guardrails: production change references, verified restore points, clone registration, preflight failure, scheduling/execution, version updates, migration validation, database-scoped Liquibase state and rollback, unsupported capabilities, retirement, handoff, and audit records. The manager demo test runs on desktop and mobile, checks keyboard focus and platform selection, and verifies demo cleanup preserves existing backups. The connected-stack test checks automatic change creation, explicit reviewer approval, route progression, correlation IDs, service registration, provider bindings, contextual tool handoffs, service insights and mobile overflow. Control-plane checks cover freshness, input types, sequencing, deduplication, drift, persisted runs, pinned revisions, approval gates and scoped developer screens.

Tests use `/usr/bin/chromium` in the cloud environment. The manager test falls back to Playwright's installed Chromium elsewhere. Set `DEMO_TEST_URL` to use another local server.

## GitHub Pages

`.github/workflows/deploy-pages.yml` builds the static production frontend after pushes to `main` or a manual workflow dispatch. Relative asset URLs support repository subpaths.

Use **Settings → Pages → Source → GitHub Actions** for workflow-based publishing. The currently available GitHub integration can deploy a Pages artifact but cannot change that administrative setting. If legacy branch publishing is still configured, it also triggers a source build; cancel the source build for the same commit before deploying the built artifact to prevent it replacing the frontend with raw source.

Site: `https://ddecoursey.github.io/BasePort/`. No custom deployment secrets or application API keys are required.
