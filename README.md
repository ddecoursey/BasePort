# BasePort — a shared DBaaS service layer

A frontend-only, MetLife-tailored proof of concept across Oracle, SQL Server, Db2, PostgreSQL, MongoDB and Cloudera. Fictional services illustrate ownership, policy, recovery and lifecycle workflows across the existing enterprise stack.

BasePort provides a consistent service experience and takes care of repetitive workflow context. Vendor consoles retain engine administration; Grafana and Elastic retain observability; ServiceNow remains the change authority. Provisioning calls the existing **giportal → Ansible AAP** flow. Recovery calls the configured **Rubrik or platform-native** provider. Git and Liquibase own relational schema delivery. These are illustrative bindings, not claims about MetLife production coverage.

The standalone website demonstrates a service layer that could launch from giportal with shared identity or be embedded there. It does not require replacing those tools.

## Experience

- **Services:** start with a service. Summary, Recovery, Changes and History keep the work in context. One readiness indicator summarizes policy and evidence freshness. Filters support platform, attention and retired records.
- **Requests:** one Configure → Review → Approval → Execution → Outcome flow. Change context is generated automatically. Only explicit simulated DBRE approval enables execution; request records persist while navigating.
- **Automation:** DBREs maintain versioned golden paths and pinned AAP/Git bindings. Requests keep the revision they were created with. Recovery and schema delivery retain their provider-specific runners.
- **Workspace settings:** connections and advanced agentless reporting. Existing jobs send bounded facts; scheduled read-only collection catches changes outside BasePort. No resident agent is needed. Try fresh, drift, duplicate and older observations.

Developers see their fictional Policy Servicing team's services and requests. DBREs see the estate and automation. Use `?view=dbre` for the DBRE view. Persona switching demonstrates UX, not authentication or authorization.

Freshness, verified restore points and execution-time checks gate sensitive lifecycle actions. Restores create development clones; migrations simulate same-engine staging moves. Targets start without protection or evidence. Schema rollback applies only defined inverses to that service. Retirement retains records. No real SQL, infrastructure or vendor API calls occur.

See [the agentless control plane proposal](docs/agentless-control-plane.md) for reporting, trust boundaries and production reconciliation design. All state is in memory and resets on reload. All jobs, approvals, backups, endpoints, versions and integrations are mocked.

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

Checks cover workflow state and races, explicit approvals, scope, pinned revisions, drift preservation, schema rollback, isolated clones, registration, freshness, agentless input validation and desktop/mobile interactions. The tour is checked for focus containment and restoring existing work. Browser tests use `/usr/bin/chromium` in the cloud environment or Playwright's Chromium elsewhere. Set `DEMO_TEST_URL` to target a different local server. `npm run test:control` runs model checks without a server.

```sh
npm run build -- --base=./
npm run preview
```

## Binaya's tour

Share [the manager demo](https://ddecoursey.github.io/BasePort/?demo=binaya) for a six-step interactive explanation of the shared service layer, two personas, automated paperwork, golden paths and agentless reporting. Choose a platform, go Back, Replay or Escape. Temporary tour records are removed and previous work is restored on exit. **Take the tour** in the header opens it anytime.

## Visual identity

The custom BasePort folded gateway mark represents an open service layer across execution tools. A dedicated favicon and monochrome SVG live in `public/`. MetLife is identified only in the workspace selector; no MetLife logo is used.

The palette uses published MetLife colors and **Gradient 6 (#A4CE4E → #0090DA)**, with a restrained gradient rule and action accents. Sources: [Color guidance](https://design.metlife.com/foundations/standards/color/) and [Graphics guidance](https://design.metlife.com/foundations/core-guidance/graphics/). This POC does not claim full design-system certification.

## GitHub Pages

[Live site](https://ddecoursey.github.io/BasePort/). `.github/workflows/deploy-pages.yml` builds and publishes the production artifact on pushes to `main` or manual dispatch. Relative assets support repository subpaths.

Configure **Settings → Pages → Source → GitHub Actions** for workflow publishing. The currently available GitHub integration cannot change that administrative setting. If legacy branch publishing remains configured, cancel its source-build run for the same commit before the production artifact deploys, so raw source cannot replace the frontend. No custom application secrets are required.
