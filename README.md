# BasePort — a shared DBaaS service layer

A frontend-only, MetLife-tailored proof of concept across Oracle, SQL Server, Db2, PostgreSQL, MongoDB and Cloudera. Fictional services illustrate ownership, policy, recovery and lifecycle workflows across the existing enterprise stack.

BasePort provides a consistent service experience and takes care of repetitive workflow context. Vendor consoles retain engine administration; Grafana and Elastic retain observability; ServiceNow remains the change authority. Provisioning calls the existing **giportal → Ansible AAP** flow. Recovery calls the configured **Rubrik or platform-native** provider. Git and Liquibase own relational schema delivery. These are illustrative bindings, not claims about MetLife production coverage.

The standalone website demonstrates a service layer that could launch from giportal with shared identity or be embedded there. It does not require replacing those tools.

## Experience and spaces

The original sidebar, overview dashboard, gradient illustration, six-platform catalog tiles and table-based database inventory are restored. The current custom BasePort identity and MetLife palette are retained.

A **space** combines a resource scope with capabilities. Its selection controls the dashboard, inventory, requests, backups, schema delivery, policy, agentless reporting and automation bindings.

| Audience | Space | Experience |
| --- | --- | --- |
| Developer | Personal — My databases | Databases assigned to Jamie Davis, their requests, recovery and schema delivery. Another developer's databases remain outside this space, even on the same team. |
| DBRE | Platform — PostgreSQL, Oracle, SQL Server, Db2, MongoDB or Cloudera | Assigned platform services, lifecycle operations, related requests, golden paths, drift and bounded agentless facts. |
| Management | Enterprise fleet or business portfolio | Read-only aggregate service counts, production distribution, protection coverage, attention, capacity and lifecycle demand. |

Management views receive an aggregate projection. They expose no database names, endpoints, SQL, version details, change/job references, automation bindings, reporting workbench or operational controls. Management tours stay within these summaries.

Use the sidebar **Space** selector to move between spaces available to the current demo identity. Switching spaces clears open dialogs, selected records and search. Platform publishing updates only that platform's binding; existing requests retain their original revision. Personal ownership carries into new services and restore clones. Counts and related records come from the same scoped state.

Deep links:

- [Personal space](https://ddecoursey.github.io/BasePort/?view=developer&space=personal)
- [PostgreSQL platform space](https://ddecoursey.github.io/BasePort/?view=dbre&space=platform-postgres)
- [Enterprise fleet](https://ddecoursey.github.io/BasePort/?view=management&space=fleet)

**Demo role** switches illustrative identities. This frontend models visibility and action boundaries; it does not implement authentication or enforce confidentiality against browser developer tools. Production membership, record filtering and action authorization must be enforced server-side using authenticated identity. The six platform spaces illustrate assigned grants, not automatic access for every production DBRE.

Freshness, verified restore points and execution-time checks gate sensitive lifecycle actions. Restores create development clones; migrations simulate same-engine staging moves. Targets start without protection or evidence. Schema rollback applies only defined inverses to that service. Retirement retains records. No real SQL, infrastructure or vendor API calls occur.

See [the agentless control plane proposal](docs/agentless-control-plane.md) and [spaces and capabilities](docs/spaces.md). All state is in memory and resets on reload. All jobs, approvals, backups, endpoints, versions and integrations are mocked.

## Run and validate

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev -- --port 3000
```

With the development server running:

```sh
npm test
```

Checks cover assignment-based personal visibility, platform boundaries, related-record filtering, isolated automation revisions, aggregate-only management, workflow races, approvals, schema rollback, clone ownership, freshness and bounded agentless input. Browser checks exercise the restored desktop and mobile UI and assert technical data and controls are absent from management screens. The tour is checked for focus containment and restoring existing work. Browser tests use `/usr/bin/chromium` in the cloud environment or Playwright's Chromium elsewhere. Set `DEMO_TEST_URL` to target a different local server. `npm run test:control` runs model checks without a server.

```sh
npm run build -- --base=./
npm run preview
```

## Binaya's tour

Share [the manager demo](https://ddecoursey.github.io/BasePort/?demo=binaya) for a six-step explanation of spaces, scoped self-service, platform operations and read-only fleet visibility. The link opens Management by default. DBRE tours can try a platform space; all tours support Back, Replay and Escape and restore the previous space and screen. **Guided manager demo** in the sidebar opens it anytime.

## Visual identity

The custom BasePort folded gateway mark represents an open service layer across execution tools. A dedicated favicon and monochrome SVG live in `public/`. MetLife is identified only in the workspace selector; no MetLife logo is used.

The palette uses published MetLife colors and **Gradient 6 (#A4CE4E → #0090DA)**, with a restrained gradient rule and action accents. Sources: [Color guidance](https://design.metlife.com/foundations/standards/color/) and [Graphics guidance](https://design.metlife.com/foundations/core-guidance/graphics/). This POC does not claim full design-system certification.

## GitHub Pages

[Live site](https://ddecoursey.github.io/BasePort/). `.github/workflows/deploy-pages.yml` builds and publishes the production artifact on pushes to `main` or manual dispatch. Relative assets support repository subpaths.

Configure **Settings → Pages → Source → GitHub Actions** for workflow publishing. The currently available GitHub integration cannot change that administrative setting. If legacy branch publishing remains configured, cancel its source-build run for the same commit before the production artifact deploys, so raw source cannot replace the frontend. No custom application secrets are required.
