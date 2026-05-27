## Goal
Create a ~20-second branded explainer video for the home page that shows visitors how this SaaS starter helps them ship in days, not months. Render to MP4 and embed it on `/` (Index.tsx), replacing the current static mock dashboard preview in the hero.

## Creative direction
- **Aesthetic**: Tech Product — clean, confident, slightly cinematic. Matches the existing site (Inter/sans, primary blue, gradient mesh background, dark+light mode polish).
- **Palette**: pulled from `src/index.css` tokens — primary blue, soft mesh gradient background, neutral foreground, success green accents. Stated as hex in the script.
- **Typography**: Inter (body) + Space Grotesk (display) via `@remotion/google-fonts`, to match the site's font stack.
- **Motion system**: smooth spring-in entrances (damping 20, stiffness 200), 18–24f staggered reveals, subtle parallax on background mesh, `wipe` + `fade` transitions between scenes. One accent moment per scene (number count-up, checkmark pop, logo lockup).
- **Duration**: 600 frames @ 30fps = 20s. 1920×1080.

## Scene plan
1. **Hook (0–3s)** — "Build your SaaS in days, not months." Large kinetic type, mesh gradient background, primary CTA color pulse.
2. **The problem (3–6s)** — Stack of greyed-out boring tasks (Auth, Billing, Emails, Teams, Analytics…) sliding in, then crossed off one by one.
3. **What's included (6–11s)** — Bento grid of 6 feature tiles (Lock, CreditCard, Mail, Users, BarChart3, Shield) springing in with staggered icons + labels.
4. **Proof / numbers (11–15s)** — Three count-up stat cards: "14-day trial", "8+ features", "Days, not months." Mirrors the in-page dashboard mock styling.
5. **Close (15–20s)** — Logo lockup, tagline "Replace the branding. Ship.", subtle CTA chip "Start free →" (non-interactive visual only).

## Technical approach
- Scaffold `remotion/` project per the video-creator skill (bun init, install Remotion + transitions + google-fonts + musl compositor, patch gnu compositor binary, symlink ffmpeg/ffprobe).
- Files: `src/index.ts`, `src/Root.tsx`, `src/MainVideo.tsx`, `src/scenes/Scene1..5.tsx`, `src/components/PersistentBackground.tsx`.
- All motion via `useCurrentFrame()` + `interpolate()` / `spring()`. No CSS animation.
- `<TransitionSeries>` with `fade` and `wipe` between scenes; total duration accounts for transition overlaps.
- Render via `scripts/render-remotion.mjs` (programmatic, `chromeMode: "chrome-for-testing"`, `muted: true`, concurrency 1) to `/mnt/documents/explainer.mp4`.
- Spot-check 3 key frames with `bunx remotion still` before final render.

## Home-page integration
- Copy the rendered MP4 into `public/explainer.mp4`.
- In `src/pages/Index.tsx`, replace the faux-dashboard `<Card>` block inside the hero (currently the `aspect-[16/9]` mock) with an autoplay, muted, loop, playsInline `<video>` wrapped in the same `<Card>` chrome (window dots + URL bar preserved) so the hero layout is unchanged.
- Add a `poster` image (rendered still from frame 30) for fast first paint.
- Add a one-line entry to `src/data/changelog.ts` under today's date: `added` — "Home page explainer video".

## Out of scope
- No audio/voiceover (muted autoplay; ffmpeg in sandbox lacks AAC anyway).
- No changes to other marketing pages, no new routes, no DB/edge changes.
- No SEO changes beyond the existing PageSeo on `/`.

## Deliverables
- `/mnt/documents/explainer.mp4` (downloadable)
- `public/explainer.mp4` + `public/explainer-poster.jpg` in the repo
- Updated `src/pages/Index.tsx` hero
- Versioned `remotion/` source folder so the video can be re-rendered or tweaked later
- Changelog entry
