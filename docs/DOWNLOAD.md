# Neo Geo Bootstrap

A Bootstrap 6.0.0-alpha.1 revival of Divshot's Geo theme.

[Live demo](https://neo-geo-bootstrap.lakebed.app) · [Source and development guide](https://github.com/jkg0x11/neo-geo-bootstrap)

## Open the demos

Unzip this archive and open `index.html` for the showcase or `gallery.html` for the complete component catalogue. The scripts, styles, and graphics are included locally.

## Use the theme

Copy `theme/` to your site, keeping `img/` beside the stylesheet. Load Bootstrap 6.0.0-alpha.1 first:

```html
<link rel="stylesheet" href="bootstrap.min.css">
<link rel="stylesheet" href="theme/geo-bootstrap.css">
```

Use Bootstrap's own JavaScript plugins for interactive components. The optional `theme/geo-bootstrap.js` focus helper exports `installGeoEnhancements()`; import it and call that function after loading Bootstrap.

See [coverage.md](coverage.md) for component support and verification limits. This targets the pinned alpha; later releases may change APIs. The demo guestbook saves locally in your browser, and its visitor counter is decorative.

## Licence and credits

Released under [MIT](LICENSE), matching Divshot's original Geo theme. Original notices are retained in [DIVSHOT-LICENSE](DIVSHOT-LICENSE) and `legacy/`. Dependency notices are in [BOOTSTRAP-LICENSE](BOOTSTRAP-LICENSE), [CALENDAR-LICENSE](CALENDAR-LICENSE), and [FLOATING-UI-LICENSE](FLOATING-UI-LICENSE).

Original theme and graphics: [Divshot](https://github.com/divshot/geo-bootstrap). This is an independent port, not an official Divshot or Bootstrap release. Historical third-party logos remain their owners' marks.
