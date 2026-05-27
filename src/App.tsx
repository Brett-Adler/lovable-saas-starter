import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { OrganizationProvider } from "@/hooks/useOrganization";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Newsletter from "./pages/Newsletter";
import Demo from "./pages/Demo";
import Waitlist from "./pages/Waitlist";
import Legal from "./pages/Legal";
import Readme from "./pages/Readme";
import CheckoutReturn from "./pages/CheckoutReturn";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import NewOrganization from "./pages/dashboard/NewOrganization";
import OrganizationSettings from "./pages/dashboard/OrganizationSettings";
import Members from "./pages/dashboard/Members";
import Invitations from "./pages/dashboard/Invitations";
import Billing from "./pages/dashboard/Billing";
import Settings from "./pages/dashboard/Settings";
import AcceptInvite from "./pages/AcceptInvite";
import AdminIndex from "./pages/admin/AdminIndex";
import AdminLeads from "./pages/admin/Leads";
import AdminSiteSettings from "./pages/admin/SiteSettings";
import AdminSubscribers from "./pages/admin/Subscribers";
import AdminBroadcasts from "./pages/admin/Broadcasts";
import AdminUsers from "./pages/admin/Users";
import AdminOrganizations from "./pages/admin/Organizations";
import AdminSubscriptions from "./pages/admin/Subscriptions";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminAudit from "./pages/admin/Audit";
import Unsubscribe from "./pages/Unsubscribe";
import NewsletterConfirm from "./pages/NewsletterConfirm";
import Accessibility from "./pages/Accessibility";
import SitemapPage from "./pages/Sitemap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <OrganizationProvider>
            <Routes>
              {/* Marketing */}
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/waitlist" element={<Waitlist />} />
              <Route path="/privacy" element={<Legal title="Privacy Policy" kind="privacy" />} />
              <Route path="/terms" element={<Legal title="Terms of Service" kind="terms" />} />
              <Route path="/cookies" element={<Legal title="Cookie Policy" kind="cookies" />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/sitemap" element={<SitemapPage />} />
              <Route path="/readme" element={<Readme />} />
              <Route path="/checkout/return" element={<CheckoutReturn />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/newsletter/confirm" element={<NewsletterConfirm />} />

              {/* Auth */}
              <Route path="/login" element={<Auth mode="login" />} />
              <Route path="/signup" element={<Auth mode="signup" />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/invite/:token" element={<AcceptInvite />} />

              {/* App */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/organization/new"
                element={
                  <ProtectedRoute>
                    <NewOrganization />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/organization"
                element={
                  <ProtectedRoute>
                    <OrganizationSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/members"
                element={
                  <ProtectedRoute>
                    <Members />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/invitations"
                element={
                  <ProtectedRoute>
                    <Invitations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/billing"
                element={
                  <ProtectedRoute>
                    <Billing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Admin */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminIndex />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/leads"
                element={
                  <ProtectedRoute>
                    <AdminLeads />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/site-settings"
                element={
                  <ProtectedRoute>
                    <AdminSiteSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/subscribers"
                element={
                  <ProtectedRoute>
                    <AdminSubscribers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/broadcasts"
                element={
                  <ProtectedRoute>
                    <AdminBroadcasts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/organizations"
                element={
                  <ProtectedRoute>
                    <AdminOrganizations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/subscriptions"
                element={
                  <ProtectedRoute>
                    <AdminSubscriptions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute>
                    <AdminAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/audit"
                element={
                  <ProtectedRoute>
                    <AdminAudit />
                  </ProtectedRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </OrganizationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
