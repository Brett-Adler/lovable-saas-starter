import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type OrgRole = "owner" | "admin" | "member";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  plan: string;
}

export interface OrgMembership extends Organization {
  role: OrgRole;
}

interface OrgContextValue {
  memberships: OrgMembership[];
  currentOrg: OrgMembership | null;
  setCurrentOrgId: (id: string | null) => void;
  refresh: () => Promise<void>;
  loading: boolean;
}

const STORAGE_KEY = "lovable.currentOrgId";

const OrgContext = createContext<OrgContextValue | undefined>(undefined);

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<OrgMembership[]>([]);
  const [currentOrgId, setCurrentOrgIdState] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null,
  );
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setMemberships([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("organization_members")
      .select("role, organizations:organization_id (id, name, slug, logo_url, plan)")
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to load orgs", error);
      setMemberships([]);
      setLoading(false);
      return;
    }

    const list: OrgMembership[] = (data ?? [])
      .filter((row: any) => row.organizations)
      .map((row: any) => ({
        id: row.organizations.id,
        name: row.organizations.name,
        slug: row.organizations.slug,
        logo_url: row.organizations.logo_url,
        plan: row.organizations.plan,
        role: row.role as OrgRole,
      }));

    setMemberships(list);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const setCurrentOrgId = useCallback((id: string | null) => {
    setCurrentOrgIdState(id);
    if (typeof window !== "undefined") {
      if (id) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Auto-select first org if none chosen
  useEffect(() => {
    if (loading) return;
    if (memberships.length === 0) {
      if (currentOrgId !== null) setCurrentOrgId(null);
      return;
    }
    const exists = memberships.some((m) => m.id === currentOrgId);
    if (!exists) setCurrentOrgId(memberships[0].id);
  }, [memberships, loading, currentOrgId, setCurrentOrgId]);

  const currentOrg = useMemo(
    () => memberships.find((m) => m.id === currentOrgId) ?? null,
    [memberships, currentOrgId],
  );

  return (
    <OrgContext.Provider
      value={{ memberships, currentOrg, setCurrentOrgId, refresh: load, loading }}
    >
      {children}
    </OrgContext.Provider>
  );
};

export const useOrganization = () => {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrganization must be used within OrganizationProvider");
  return ctx;
};
