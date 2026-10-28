# Development guide

Published on Lakebed: **https://neo-geo-bootstrap.lakebed.app** · [Full component catalogue](https://neo-geo-bootstrap.lakebed.app/gallery).

The Lakebed capsule lives in `lakebed/neo-geo-bootstrap/`. Rebuild its snapshot with `npm run build:lakebed`, then deploy from that directory using `npx lakebed deploy`. Its saved `lakebed.json` binding points subsequent updates at the same owned app. The showcase embeds its verified offline assets so it fits Lakebed’s hosting model and 1 MiB artifact limit; no CDN assets or database are needed. The browser builds the downloadable ZIP locally from those exact files.

An unofficial revival of [Divshot’s Geo theme](https://github.com/divshot/geo-bootstrap), built for **Bootstrap 6.0.0-alpha.1**. Rainbow buttons, Comic Sans, tiled textures, starfields, and the original decorative GIFs.

Bootstrap 6 is an alpha. This theme targets this exact version; future alphas may change component names or tokens. It does not target Bootstrap 5.

## Run the demo

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Build with `npm run build`; run browser checks with `npm test` (install the test browsers with `npx playwright install chromium firefox webkit` if needed).

## Use the theme

Copy `public/theme/` to your site. Keep `img/` beside `geo-bootstrap.css`. Load Bootstrap first, then Geo:

```html
<link rel="stylesheet" href="bootstrap.min.css">
<link rel="stylesheet" href="theme/geo-bootstrap.css">
```

Only the theme stylesheet and its referenced assets are required. `demo.css` and `main.js` belong to the demo, not the theme. Use Bootstrap 6’s ESM plugins for interactive components.

For the keyboard behaviour verified in the catalogue, also install the optional companion helper after importing Bootstrap:

```js
import { installGeoEnhancements } from './theme/geo-bootstrap.js';
const removeEnhancements = installGeoEnhancements();
// Call removeEnhancements() when tearing down your app, if needed.
```

This normalises focus on opened dialogs/drawers and clicked menu items, including WebKit’s different click-focus behaviour. It uses Bootstrap lifecycle events and does not replace any plugin. Its editable source is `geo-enhancements.js`; the build copies it into the downloadable theme directory.

### Bootstrap 6 markup

```html
<button class="btn btn-solid theme-primary">Rainbow button</button>
<button class="btn btn-solid theme-success">Success</button>
<div class="alert theme-warning" role="alert">Under construction!</div>
<input class="form-control" aria-label="Screen name">
<select class="form-control" aria-label="Internet mood">
  <option>Surfing the web</option>
</select>
```

This uses v6’s composable `theme-*` colors, `menu` plugin, native `<dialog>` component, native `<details>` accordions, and current CSS tokens. It is not the old Bootstrap 2 stylesheet with renamed classes.

The complete catalogue is in **`gallery.html`**. Coverage is audited against the installed release: **53 SCSS modules and all 20 exported JavaScript plugins**, including the new combobox, chips/chip input, datepicker, OTP, strength, range, avatars, stepper, drawer, overflow navigation, and toggler. See [the full coverage report](../public/coverage.md) and its machine-readable inventory in `public/coverage.json`.

Bootstrap’s data APIs, positioning, focus management, responsive variants, helpers and utilities are preserved. Geo component rules live in Bootstrap’s `custom` CSS layer so later helpers and utilities continue to override them. Semantic `theme-*` colours, button variants/sizes/groups, disabled/selected/invalid controls, and overlay states are included. The theme applies globally; load it only where you want the full Geo look.

## Download

`npm run build` creates `artifacts/neo-geo-bootstrap.zip` containing the reusable `theme/` directory, compiled offline showcase (`index.html`), full catalogue (`gallery.html`), coverage report, and license notices. Unzip and open either HTML file directly. Calendar and Floating UI dependencies are bundled locally. On a hosted site the demo’s download buttons serve the same ZIP; in an extracted offline copy, use the included theme files directly.

The demo’s guestbook stores messages only in the current browser when its save checkbox is selected. It has no backend, analytics, or remote font/asset dependencies. The visitor counter is decorative. Motion controls and reduced-motion preferences stop the ticker and animated backgrounds and hide decorative animated images. Browser badges are decorative historical artwork, not compatibility claims.

## Verification

`npm run audit` compares the manifest with Bootstrap’s actual SCSS and JavaScript entrypoints and fails on missing/stale modules or a version change. `npm test` checks both showcases and the offline build, including all 20 plugin families, form states, utility precedence, wide/narrow layouts, guestbook safety, and missing assets/runtime errors. Finished screenshots are retained in `evidence/`.

The default suite runs Chromium and WebKit. Firefox verification is optional (`GEO_FIREFOX=1 npm test`): its installed headless browser could not launch on this Mac (`Could not find profile folder`), including with a different temporary directory. Firefox compatibility is unverified here.

Alpha.1 has a known upstream console message when its Combobox creates an internal Menu on the same element: `Bootstrap doesn't allow more than one instance per element. Bound instance: bs.combobox.` The catalogue tests exercise search/empty/multiple selection and keyboard dismissal despite this upstream diagnostic; other console errors fail the checks. Bootstrap itself remains unmodified. The inline range calendar uses the public date-change event and an external hidden input because the calendar renderer replaces its container contents. This is a theme regression suite with representative variants, not every possible permutation of all upstream options.

## Credits & license

Original concept, texture/GIF assets, and theme: Divshot, Inc. The original MIT notice is preserved in `public/legacy/LICENSE` and in the download. The supplied artwork is retained from the original repository; historical third-party logos remain their respective owners’ marks. This is an independent port, not an official Divshot or Bootstrap release. New code is MIT licensed. Bootstrap’s license is included with the download.
