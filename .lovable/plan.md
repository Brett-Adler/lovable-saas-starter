## Problem

Clicking footer links (and other internal links) navigates to the new route but keeps the previous scroll position. Anchor links like `/#features` don't scroll to the section either — especially when navigating from a different route.

## Plan

1. **Add a `ScrollToTop` route observer** (`src/components/ScrollToTop.tsx`)
   - Uses `useLocation()` from react-router.
   - On `pathname` change with no `hash`: `window.scrollTo(0, 0)`.
   - On `hash` change (or pathname change *with* a hash): wait one frame, then find `document.getElementById(hash.slice(1))` and `scrollIntoView({ behavior: "smooth", block: "start" })`. Fall back to top if the element isn't found.
   - Skip when navigation includes `state.preserveScroll` (escape hatch for future use).

2. **Mount it inside `BrowserRouter`** in `src/App.tsx`, above `<Routes>`, so it runs on every route change.

3. **Fix footer anchor links to work cross-route**
   - In `MarketingFooter.tsx`, links starting with `/#` are currently plain `<a href>` tags, which trigger a full page reload. Convert them to `<Link to="/" hash="#features">`-style (using `{ pathname: "/", hash: "#features" }`) so the new `ScrollToTop` handler can smooth-scroll to the section without a reload.

## Out of scope

- No changes to header nav, dashboard shell, or other link components — only the route-level scroll behavior and the footer's anchor links. Other components already using `<Link>` will automatically benefit from `ScrollToTop`.
