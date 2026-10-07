# Spaces and capabilities

Spaces make one DBaaS portal useful to different audiences without giving everyone an operator's interface. A space is a resource selection plus an explicitly granted capability set, not just a saved filter.

## Demo membership

Jamie Davis has a personal space with assigned databases. Avery Patel has six illustrative platform spaces; the active one scopes all operational records and controls to that platform. Binaya has read-only enterprise and Policy Servicing portfolios. Switching the demo role changes identity; it does not represent a production privilege escalation.

Personal scope follows `ownerId`, not owning team alone. New personal services receive the developer's owner ID. Restored and migrated targets retain source ownership. Pending provisioning requests are scoped before a database exists. Backups, schema state, observations and request history are selected by in-scope service IDs. Platform paths are shared contracts with separate platform revisions and pinned request snapshots.

Management components receive only aggregate projections: platform and business-unit counts, protection coverage, service attention, declared capacity, environment distribution and open demand. No service identities, engine versions, endpoints, SQL, observations, runner bindings, change references or job IDs appear in that projection. Their navigation and tours stay within portfolio views.

## Production implementation

The POC contains fictional records in a downloadable frontend bundle. Its filtering and action guards illustrate the contract; they cannot secure data already delivered to a browser. Production services must:

- Authenticate identity and load explicit space memberships and capabilities from the enterprise identity/authorization layer.
- Apply resource and field scope at every read endpoint. Return aggregate projections to portfolio-only identities and avoid delivering underlying technical records.
- Authorize every operation, change approval, golden-path publish, contextual handoff and reporting callback on the server. A space ID supplied by a client does not grant membership.
- Revalidate approval and current service scope before dispatch. Preserve correlated jobs across UI space changes without granting new readers access.
- Scope automation bindings and publisher identities per platform/service. Reject telemetry from publishers without the required assignment and field authority.
- Audit membership changes, approvals and actions, and reconcile spaces with CMDB/service ownership. Use explicit resource assignments for shared applications rather than inferring personal access from a team label.

Spaces can be personal, application/team, platform or portfolio scopes. Roles define capabilities within a space; memberships define which resources an identity can use. A production DBRE can belong to one or more platform spaces, and a manager can have fleet summaries without technical access.
