import { describe, it, expect, beforeEach } from "vitest";
import "../mocks/supabase";
import { resetSupabaseResponses } from "../mocks/supabase";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../utils";

import Index from "@/pages/Index";
import Pricing from "@/pages/Pricing";
import Features from "@/pages/Features";
import NotFound from "@/pages/NotFound";
import Status from "@/pages/Status";
import Blog from "@/pages/Blog";
import Roadmap from "@/pages/Roadmap";
import Changelog from "@/pages/Changelog";
import Sitemap from "@/pages/Sitemap";
import Accessibility from "@/pages/Accessibility";
import Readme from "@/pages/Readme";
import Launch from "@/pages/Launch";
import Integrations from "@/pages/Integrations";
import Security from "@/pages/Security";

beforeEach(() => resetSupabaseResponses());

const cases: Array<{ name: string; route: string; element: React.ReactElement; expect: RegExp }> = [
  { name: "Index", route: "/", element: <Index />, expect: /./ },
  { name: "Pricing", route: "/pricing", element: <Pricing />, expect: /pricing/i },
  { name: "Features", route: "/features", element: <Features />, expect: /features/i },
  { name: "NotFound", route: "/nope", element: <NotFound />, expect: /404|can't find/i },
  { name: "Status", route: "/status", element: <Status />, expect: /system status/i },
  { name: "Blog", route: "/blog", element: <Blog />, expect: /blog/i },
  { name: "Roadmap", route: "/roadmap", element: <Roadmap />, expect: /roadmap/i },
  { name: "Changelog", route: "/changelog", element: <Changelog />, expect: /changelog/i },
  { name: "Sitemap", route: "/sitemap", element: <Sitemap />, expect: /sitemap/i },
  { name: "Accessibility", route: "/accessibility", element: <Accessibility />, expect: /accessibility/i },
  { name: "Readme", route: "/readme", element: <Readme />, expect: /./ },
  { name: "Launch", route: "/launch", element: <Launch />, expect: /launch/i },
  { name: "Integrations", route: "/integrations", element: <Integrations />, expect: /integrations/i },
  { name: "Security", route: "/security", element: <Security />, expect: /security/i },
];

describe("page smoke renders", () => {
  for (const c of cases) {
    it(`${c.name} mounts without throwing`, () => {
      renderWithProviders(c.element, { route: c.route });
      // At least one matching element must be visible.
      const matches = screen.queryAllByText(c.expect);
      expect(matches.length, `expected text matching ${c.expect} on ${c.name}`).toBeGreaterThan(0);
    });
  }
});
