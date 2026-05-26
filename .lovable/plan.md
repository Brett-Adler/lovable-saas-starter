## Plan — public pages, footer, contact, admin

### 1. New public pages
- **`/accessibility`** — `src/pages/Accessibility.tsx`: WCAG 2.1 AA statement, contact email for accessibility issues, last-updated date.
- **`/sitemap`** — `src/pages/Sitemap.tsx`: human-readable index of every public route, grouped (Product / Company / Legal / Resources / Account).
- Register both in `src/App.tsx`.
- Update `src/pages/Legal.tsx` to add a third `kind: "cookies"` variant and register `/cookies` (Cookie Policy placeholder, same style as Privacy/Terms).
- Replace the lorem-ipsum body in `Legal.tsx` with a more realistic placeholder template (sections: data collected, purposes, third parties, retention, your rights, contact) so users can edit rather than rewrite.

### 2. XML sitemap + robots
- Create `scripts/generate-sitemap.ts` listing every public route. Wire `predev` + `prebuild` in `package.json` to run it.
- Ensure `public/robots.txt` exists and references `Sitemap: https://saas-starter-suite.lovable.app/sitemap.xml`.

### 3. Footer — site-wide + social links + admin-managed
- New table `public.site_settings` (singleton, id=1) with columns: `social_twitter`, `social_github`, `social_linkedin`, `social_instagram`, `social_youtube`, `social_facebook`, `social_tiktok`, `contact_email`, `updated_at`.
  - Grants: `SELECT` to `anon` + `authenticated` (public site reads it); `ALL` to `service_role`; admin-only `UPDATE`/`INSERT` via RLS using `has_role(auth.uid(),'admin')`.
- New hook `src/hooks/useSiteSettings.tsx` fetches the row once (React Query).
- Rewrite `MarketingFooter.tsx`:
  - Columns: **Product** (Features, Pricing, Demo, Waitlist), **Company** (About, Contact, Newsletter), **Legal** (Privacy, Terms, Cookies, Accessibility), **Resources** (Setup guide, Sitemap).
  - Social icon row (lucide icons: Twitter, Github, Linkedin, Instagram, Youtube, Facebook + a TikTok SVG) — only render icons whose URL is set in `site_settings`.
  - Keep newsletter + copyright.

### 4. Home page — links to everything
- In `src/pages/Index.tsx`, add a compact "Explore" link strip above the final CTA listing all public pages (uses same data source as footer). Footer remains the canonical site map.

### 5. Contact form persistence + admin viewer
- Update `src/pages/Contact.tsx` to insert into existing `public.leads` table with `kind='contact'`, mapping `subject`→`source`, full text→`message`, `name`, `email`. Remove the dead `lead_submissions` insert. Keep honeypot + zod validation.
- Confirmation toast unchanged. No email sending yet (existing email pipeline isn't wired to leads; out of scope unless asked).
- Build **`src/pages/admin/Leads.tsx`**: paginated table of `leads` (filter by `kind`, `status`), row detail drawer with full message, status dropdown (`new`/`contacted`/`qualified`/`archived` — use whatever the existing `lead_status` enum exposes), notes textarea. Uses existing admin RLS.
- Build **`src/pages/admin/SiteSettings.tsx`**: form to edit social URLs + contact email. Save via `upsert` on id=1.
- Update `src/pages/admin/AdminIndex.tsx`: replace the "Leads" and "Marketing" placeholder cards with real links; add a new "Site settings" card. Register the two new routes in `App.tsx` (admin-only via `ProtectedRoute` + in-page `isAdmin` check, matching `AdminIndex`).

### 6. Light copy refresh
- **Pricing** — keep existing template-disclaimer alert. Add a short comparison-table teaser sentence under the tiers ("Need a full feature comparison? See [Features](/#features).").
- **Features** — no new section needed; the home `#features` grid covers it. Add anchor links from the home features grid items to relevant docs in `/readme` where applicable (light touch).
- **About** — extend with a 3-bullet "What's in the box" list and a CTA row linking to `/contact` and `/pricing`.
- **Contact** — replace the placeholder `hello@example.com` with `{siteSettings.contact_email ?? "hello@example.com"}` so admins control it.

### Technical notes
- `site_settings` migration:
  ```sql
  CREATE TABLE public.site_settings (
    id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    social_twitter text, social_github text, social_linkedin text,
    social_instagram text, social_youtube text, social_facebook text, social_tiktok text,
    contact_email text,
    updated_at timestamptz NOT NULL DEFAULT now()
  );
  GRANT SELECT ON public.site_settings TO anon, authenticated;
  GRANT ALL ON public.site_settings TO service_role;
  ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);
  CREATE POLICY "Admins manage site settings" ON public.site_settings FOR ALL
    USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
  INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;
  ```
- Contact insert uses existing `leads` RLS policy (`Anyone can submit a lead`) — no schema change needed; `kind='contact'` already valid.
- Admin pages use `useUserRoles().isAdmin` gate identical to `AdminIndex.tsx`.
- All new files use semantic tokens only.

### Out of scope (ask later if you want them)
- Sending a confirmation email to the contact submitter (would hook into the existing email pipeline).
- A full feature-comparison table.
- Migrating the marketing campaigns admin UI.