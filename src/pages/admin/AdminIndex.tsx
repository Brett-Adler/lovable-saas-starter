import { AdminShell, AdminViewSiteLink } from "@/components/admin/AdminShell";
import { AdminOverview } from "@/components/admin/AdminOverview";

const AdminIndex = () => {
  return (
    <AdminShell
      title="Dashboard"
      description="A quick read on users, revenue, and what needs your attention."
      actions={<AdminViewSiteLink />}
    >
      <AdminOverview />
    </AdminShell>
  );
};

export default AdminIndex;
