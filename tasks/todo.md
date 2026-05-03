# Current Task

Implement a React/Ionic Leaflet places screen matching the supplied screenshots, with saved places in a separate component and two top tabs.

# Plan

- [x] Add Leaflet dependencies with Bun and import Leaflet assets correctly.
- [x] Replace the empty home page with top tabs: `FORM AND PLACES` and `MAP`.
- [x] Build a form/list tab where users can enter a place name and save it with coordinates.
- [x] Extract `Saved places` into its own component.
- [x] Build a Leaflet map tab centered around Ostrava with markers for saved places and click-to-select coordinates.
- [x] Verify with TypeScript, lint, and production build.

# Success Criteria

- The app shows two tabs at the top matching the requested labels.
- The map is rendered with Leaflet tiles and saved-place markers.
- `Saved places` is implemented as a separate React component.
- Adding a place updates both the saved list and map markers.
- `bunx tsc --noEmit --pretty false`, `bun run lint`, and `bun run build` pass or any blocker is recorded here.

# Progress Notes

- Starting from the existing empty `Home` page in a small Ionic React app.
- Installed `leaflet`, `react-leaflet`, and `@types/leaflet` with Bun.
- Added a separate `SavedPlaces` component for the `Saved places` card/list.
- Added two top tabs using Ionic segment controls.
- Added an Ostrava-centered Leaflet map with saved markers and a selected-coordinate marker.
- Map clicks update the coordinates used by the form when adding a new saved place.
- Follow-up: removed custom visual styling in favor of native Ionic components.
- Follow-up: kept only the required Leaflet container height in `Home.css` so the map has a renderable size.
- Follow-up: switched markers to Leaflet's default image assets instead of CSS-styled custom markers.
- Follow-up: changed the form text field into an Ionic search bar backed by OpenStreetMap/Nominatim geocoding.
- Follow-up: searching moves the map to the matched result, and saving now stores the selected search result.

# Results

- `bunx tsc --noEmit --pretty false` passes.
- `bun run lint` passes.
- `bun run build` passes.
