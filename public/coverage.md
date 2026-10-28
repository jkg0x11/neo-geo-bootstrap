# Neo Geo Bootstrap compatibility

Target: **Bootstrap 6.0.0-alpha.1**, pinned exactly.

Coverage: **53 shipped component/content/form/layout SCSS modules and all 20 exported JavaScript plugins**. The audit reads the actual installed Bootstrap entrypoints and fails if a module/plugin is missing or the version changes. Helpers and utilities retain Bootstrap’s implementation and take precedence over Geo component styling via the native CSS layer order.

## CSS coverage

| Shipped module | Treatment | Example |
| --- | --- | --- |
| accordion | Geo theme | [Demo](gallery.html#sample-stepper) |
| alert | Geo theme | [Demo](gallery.html#sample-toast) |
| avatar | Geo theme | [Demo](gallery.html#sample-avatar) |
| badge | Geo theme | [Demo](gallery.html#sample-toast) |
| breadcrumb | Geo theme | [Demo](gallery.html#sample-overflow) |
| chip | Geo theme | [Demo](gallery.html#sample-chips) |
| card | Geo theme | [Demo](gallery.html#sample-card) |
| carousel | Geo theme | [Demo](gallery.html#sample-carousel) |
| datepicker | Geo theme | [Demo](gallery.html#sample-datepicker) |
| dialog | Geo theme | [Demo](gallery.html#sample-overlays) |
| menu | Geo theme | [Demo](gallery.html#sample-navbar) |
| list-group | Geo theme | [Demo](gallery.html#sample-nav) |
| nav | Geo theme | [Demo](gallery.html#sample-nav) |
| nav-overflow | Geo theme | [Demo](gallery.html#sample-overflow) |
| navbar | Geo theme | [Demo](gallery.html#sample-navbar) |
| drawer | Geo theme | [Demo](gallery.html#sample-overlays) |
| pagination | Geo theme | [Demo](gallery.html#sample-overflow) |
| placeholder | Geo theme | [Demo](gallery.html#sample-loading) |
| popover | Geo theme | [Demo](gallery.html#sample-overlays) |
| progress | Geo theme | [Demo](gallery.html#sample-loading) |
| spinner | Geo theme | [Demo](gallery.html#sample-loading) |
| stepper | Geo theme | [Demo](gallery.html#sample-stepper) |
| toasts | Geo theme | [Demo](gallery.html#sample-toast) |
| tooltip | Geo theme | [Demo](gallery.html#sample-overlays) |
| transitions | Geo theme | [Demo](gallery.html#sample-navbar) |
| forms/labels | Geo theme | [Demo](gallery.html#sample-controls) |
| forms/form-text | Geo theme | [Demo](gallery.html#sample-controls) |
| forms/form-control | Geo theme | [Demo](gallery.html#sample-controls) |
| forms/check | Geo theme | [Demo](gallery.html#sample-checks) |
| forms/radio | Geo theme | [Demo](gallery.html#sample-checks) |
| forms/switch | Geo theme | [Demo](gallery.html#sample-checks) |
| forms/form-range | Geo theme | [Demo](gallery.html#sample-range) |
| forms/floating-labels | Geo theme | [Demo](gallery.html#sample-floating) |
| forms/input-group | Geo theme | [Demo](gallery.html#sample-floating) |
| forms/strength | Geo theme | [Demo](gallery.html#sample-otp) |
| forms/otp-input | Geo theme | [Demo](gallery.html#sample-otp) |
| forms/form-adorn | Geo theme | [Demo](gallery.html#sample-fields) |
| forms/chip-input | Geo theme | [Demo](gallery.html#sample-chips) |
| forms/combobox | Geo theme | [Demo](gallery.html#sample-combobox) |
| forms/form-field | Geo theme | [Demo](gallery.html#sample-fields) |
| forms/validation | Geo theme | [Demo](gallery.html#sample-controls) |
| buttons/button | Geo theme | [Demo](gallery.html#sample-buttons) |
| buttons/button-group | Geo theme | [Demo](gallery.html#sample-buttons) |
| buttons/close | Geo theme | [Demo](gallery.html#sample-overlays) |
| content/reboot | Geo theme | [Demo](gallery.html#sample-content) |
| content/lists | Geo theme | [Demo](gallery.html#sample-content) |
| content/blockquote | Geo theme | [Demo](gallery.html#sample-content) |
| content/tables | Geo theme | [Demo](gallery.html#sample-card) |
| content/images | Geo theme | [Demo](gallery.html#sample-content) |
| content/prose | Geo theme | [Demo](gallery.html#sample-content) |
| layout/breakpoints | preserved layout API | [Demo](gallery.html#sample-layout) |
| layout/containers | preserved layout API | [Demo](gallery.html#sample-layout) |
| layout/grid | preserved layout API | [Demo](gallery.html#sample-layout) |

## JavaScript coverage

- Alert: [interactive example](gallery.html#sample-toast)
- Button: [interactive example](gallery.html#sample-buttons)
- Carousel: [interactive example](gallery.html#sample-carousel)
- Collapse: [interactive example](gallery.html#sample-navbar)
- Combobox: [interactive example](gallery.html#sample-combobox)
- Datepicker: [interactive example](gallery.html#sample-datepicker)
- Dialog: [interactive example](gallery.html#sample-overlays)
- Menu: [interactive example](gallery.html#sample-navbar)
- NavOverflow: [interactive example](gallery.html#sample-overflow)
- Drawer: [interactive example](gallery.html#sample-overlays)
- Strength: [interactive example](gallery.html#sample-otp)
- OtpInput: [interactive example](gallery.html#sample-otp)
- Chips: [interactive example](gallery.html#sample-chips)
- Popover: [interactive example](gallery.html#sample-overlays)
- Range: [interactive example](gallery.html#sample-range)
- ScrollSpy: [interactive example](gallery.html#sample-nav)
- Tab: [interactive example](gallery.html#sample-nav)
- Toast: [interactive example](gallery.html#sample-toast)
- Toggler: [interactive example](gallery.html#sample-buttons)
- Tooltip: [interactive example](gallery.html#sample-overlays)

## Verification scope

Browser checks cover catalogue initialisation, missing assets/runtime errors, narrow and wide layouts, utility precedence, all button variants, form validation and disabled controls, combobox search/empty/multiple selection, chips add/remove, popup/inline date selection, OTP completion, both strength variants, range update, overflow navigation, nested menus, collapse, tabs, scrollspy, button and attribute toggles, stepper and pagination demo behaviour, native accordion, dialogs/drawers with keyboard focus restoration, tooltip/popover, toast/alert dismissal, carousel navigation, and the downloaded offline catalogue.

This is theme compatibility with this exact alpha. The styles preserve Bootstrap’s positioning, focus, responsive layout, ARIA, and data APIs; they do not replace Bootstrap plugin behaviour or promise fixes for unrelated upstream alpha bugs. Datepicker uses the release’s vanilla-calendar-pro integration; Floating UI and the calendar are bundled locally in the offline demo with licenses. Disabled/readonly/selected/invalid states are demonstrated; the catalogue is a representative regression suite, not an exhaustive permutation of every component option.

## Browser verification

The regression suite runs in Chromium and WebKit, including desktop/mobile layouts and offline files. Firefox headless could not launch on this Mac: Could not find profile folder, also with an alternate temporary directory. Firefox remains unverified; opt in with GEO_FIREFOX=1 npm test on a working installation. The optional theme/geo-bootstrap.js helper normalises dialog/drawer and clicked-menu focus across browser engines; both demos include it.

## Known upstream alpha diagnostic

Bootstrap alpha.1 Combobox constructs an internal Menu on the same element, which logs its duplicate-instance message. The catalogue preserves the unmodified release and verifies search, empty state, multiple selection, and keyboard dismissal. Unexpected console errors still fail verification. Inline calendar form values are synchronised through the public change event and an external hidden input, since the calendar renders over its container contents.

## Use

Load Bootstrap CSS followed by theme/geo-bootstrap.css. Keep theme/img beside it. Load the Bootstrap 6 plugins needed by your app. For the complete demo, unzip the download and open gallery.html. Original Geo artwork: Divshot.
