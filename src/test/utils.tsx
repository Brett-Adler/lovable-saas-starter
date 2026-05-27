import { ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { vi } from "vitest";

// Mock auth + organization providers so pages that read them don't blow up.
vi.mock("@/hooks/useAuth", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: () => ({ user: null, session: null, loading: false, signOut: vi.fn() }),
}));

vi.mock("@/hooks/useOrganization", () => ({
  OrganizationProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useOrganization: () => ({
    memberships: [],
    currentOrg: null,
    setCurrentOrgId: vi.fn(),
    refresh: vi.fn(),
    loading: false,
  }),
}));

vi.mock("@/hooks/useUserRole", () => ({
  useUserRole: () => ({ role: null, isAdmin: false, loading: false }),
}));

interface Options extends Omit<RenderOptions, "wrapper"> {
  route?: string;
}

export const renderWithProviders = (ui: ReactNode, { route = "/", ...options }: Options = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>,
    options,
  );
};
