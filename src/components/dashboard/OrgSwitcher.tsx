import { Link } from "react-router-dom";
import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useOrganization } from "@/hooks/useOrganization";
import { cn } from "@/lib/utils";

export const OrgSwitcher = () => {
  const { memberships, currentOrg, setCurrentOrgId, loading } = useOrganization();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-10 w-full rounded-md bg-muted/50 animate-pulse" />
    );
  }

  if (memberships.length === 0) {
    return (
      <Button asChild variant="outline" size="sm" className="w-full justify-start">
        <Link to="/dashboard/organization/new">
          <Plus className="h-4 w-4" />
          Create organization
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between h-10 px-3 font-normal"
        >
          <span className="flex items-center gap-2 min-w-0">
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{currentOrg?.name ?? "Select organization"}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel>Your organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {memberships.map((m) => (
          <DropdownMenuItem
            key={m.id}
            onSelect={() => setCurrentOrgId(m.id)}
            className="flex items-center justify-between gap-2 cursor-pointer"
          >
            <span className="flex items-center gap-2 min-w-0">
              <Check
                className={cn(
                  "h-4 w-4 shrink-0",
                  currentOrg?.id === m.id ? "opacity-100" : "opacity-0",
                )}
              />
              <span className="truncate">{m.name}</span>
            </span>
            <Badge variant="secondary" className="text-[10px] capitalize">
              {m.role}
            </Badge>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard/organization/new" className="cursor-pointer">
            <Plus className="h-4 w-4" />
            Create organization
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
