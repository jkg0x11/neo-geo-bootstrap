# Neo Geo Bootstrap on Lakebed

Live: https://neo-geo-bootstrap.lakebed.app · Catalogue: https://neo-geo-bootstrap.lakebed.app/gallery

This capsule publishes a self-contained snapshot of the verified Bootstrap 6 showcase and catalogue, preserving original Divshot graphics and license notices. Both pages and the downloadable ZIP use local assets.

From the parent theme project, run `npm run build:lakebed` to regenerate `shared/site.ts`. Do not edit that generated file. It contains compressed static assets, not credentials. The browser decodes them once and assembles the offline ZIP with a dependency-free ZIP writer.

From this directory run `npx lakebed dev`, `npx lakebed build`, or `npx lakebed deploy`. The root route is the showcase; `/gallery` is the full catalogue. The native Lakebed router handles navigation. There is no database, sign-in requirement, or outbound server fetch.

Keep the deployment binding in `lakebed.json` so subsequent deployments update the same app. `.lakebed/` is local runtime state and must not be published as source.
