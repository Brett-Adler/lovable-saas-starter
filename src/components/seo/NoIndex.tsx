import { Helmet } from "react-helmet-async";

/** Tells search engines not to index this route. Use on auth/dashboard/admin/checkout pages. */
export function NoIndex() {
  return (
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );
}
