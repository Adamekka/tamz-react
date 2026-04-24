# Current Task

Fix TypeScript/LSP diagnostics in this small Ionic React project and remove unused test setup.

# Plan

- [x] Remove CRA test files that introduce unused Jest globals.
- [x] Remove test-only dependencies/script entries that no longer apply.
- [x] Remove Bun runtime type definitions if they are not used by app source, because current `@types/bun` requires a newer TypeScript parser than this CRA project uses.
- [x] Verify `tsc --noEmit` and production build.

# Progress Notes

- Added a plain CSS ambient declaration in `src/react-app-env.d.ts` so TypeScript recognizes side-effect CSS imports.
- Removed `src/App.test.tsx` and `src/setupTests.ts`.
- Removed test-only dependencies and the test script from `package.json`.
- Removed unused Bun runtime types and the stray TypeScript 5 peer dependency.
- Removed `type: module` so CRA/ESLint can load `.eslintrc.js` as CommonJS.

# Results

- `bunx tsc --noEmit --pretty false` passes.
- `bun run build` passes.
- `bun run lint` passes.
