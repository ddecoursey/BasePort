# BasePort

A frontend proof of concept for an internal enterprise data platform portal. Built with React, Vite, and Lucide icons. All services, health metrics, requests, and operations are mocked; no backend or enterprise systems are contacted.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev -- --port 3000
```

## Production build

```sh
npm run build
npm run preview
```

## Explore

- **Overview:** workspace health, platform catalog, services, and recent activity.
- **Service catalog:** Oracle, SQL Server, IBM Db2, PostgreSQL, MongoDB, and Cloudera, with category filters.
- **My services:** search, environment filters, CSV export, connection endpoints, and simulated restart actions.
- **Requests:** three-step provisioning with input validation, review, status tracking, and cancellation.
- **Usage & insights:** mock resource charts, time ranges, and service distribution.
- **Settings:** locally persisted notification preferences.

Service and request changes exist only in memory and reset on refresh. Notification preferences are stored in browser localStorage. Connection endpoints and workspace identities are fictional. The interface supports desktop and mobile screens; press Escape to close dialogs or Cmd/Ctrl+K to focus search on desktop.

## Validation

Production build verified with `npm run build`. Browser smoke checks exercised provisioning and validation, filtering, service details, restart feedback, catalog categories, chart periods, saved preferences, and mobile navigation with no browser runtime errors.

## Share with GitHub Pages

The included `.github/workflows/deploy-pages.yml` builds and deploys this static frontend after pushes to `main`, or when manually run from the Actions tab.

1. Commit and push the project, including the workflow and `package-lock.json`, to GitHub.
2. In the repository, open **Settings → Pages → Build and deployment**, and set **Source** to **GitHub Actions**.
3. Open **Actions → Deploy BasePort to GitHub Pages → Run workflow** on `main` (or push another change to `main`).
4. After deployment succeeds, open the site URL shown in **Settings → Pages** or the workflow's deployment output. For `ddecoursey/BasePort`, the default URL is `https://ddecoursey.github.io/BasePort/`.

The Pages build uses relative asset URLs so it works under a repository subpath. No API keys or custom deployment secrets are required. Deployment has not been run from this workspace; the URL becomes available only after a successful GitHub deployment.
