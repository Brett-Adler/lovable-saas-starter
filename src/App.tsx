import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { OrganizationProvider } from "@/hooks/useOrganization";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ScrollToTop } from "@/components/ScrollToTop";

import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Newsletter from "./pages/Newsletter";
import Demo from "./pages/Demo";
import Waitlist from "./pages/Waitlist";
import Legal from "./pages/Legal";
import Readme from "./pages/Readme";
import Docs from "./pages/Docs";
import DocsAudience from "./pages/DocsAudience";
import DocsArticle from "./pages/DocsArticle";
import Launch from "./pages/Launch";
import Changelog from "./pages/Changelog";
import CheckoutReturn from "./pages/CheckoutReturn";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import NewOrganization from "./pages/dashboard/NewOrganization";
import OrganizationSettings from "./pages/dashboard/OrganizationSettings";
import OrgSso from "./pages/dashboard/OrgSso";
import Members from "./pages/dashboard/Members";
import Invitations from "./pages/dashboard/Invitations";
import Billing from "./pages/dashboard/Billing";
import Settings from "./pages/dashboard/Settings";
import AcceptInvite from "./pages/AcceptInvite";
import AdminIndex from "./pages/admin/AdminIndex";
import AdminLeads from "./pages/admin/Leads";
import AdminSiteSettings from "./pages/admin/SiteSettings";
import AdminSeo from "./pages/admin/SEO";
import AdminSubscribers from "./pages/admin/Subscribers";
import AdminBroadcasts from "./pages/admin/Broadcasts";
import AdminUsers from "./pages/admin/Users";
import AdminOrganizations from "./pages/admin/Organizations";
import AdminSubscriptions from "./pages/admin/Subscriptions";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminAudit from "./pages/admin/Audit";
import AdminBrand from "./pages/admin/Brand";
import Unsubscribe from "./pages/Unsubscribe";
import NewsletterConfirm from "./pages/NewsletterConfirm";
import Accessibility from "./pages/Accessibility";
import SitemapPage from "./pages/Sitemap";
import Roadmap from "./pages/Roadmap";
import StatusPage from "./pages/Status";
import Integrations from "./pages/Integrations";
import SecurityPage from "./pages/Security";
import Compare from "./pages/Compare";
import Customers from "./pages/Customers";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminBlog from "./pages/admin/Blog";
import AdminBlogEditor from "./pages/admin/BlogEditor";
import AdminStatus from "./pages/admin/Status";
import AdminAbout from "./pages/admin/About";
import DashboardSecurity from "./pages/dashboard/settings/Security";
import DashboardApiKeys from "./pages/dashboard/settings/ApiKeys";
import DashboardWebhooks from "./pages/dashboard/settings/Webhooks";
import DashboardData from "./pages/dashboard/settings/Data";
import UseTemplateLovable from "./pages/UseTemplateLovable";
import UseTemplateGithub from "./pages/UseTemplateGithub";
import NotFound from "./pages/NotFound";
import { TestShell } from "@/components/test/TestShell";
import TestIndex from "./pages/test/TestIndex";
import TestAccessibility from "./pages/test/TestAccessibility";
import TestPerformance from "./pages/test/TestPerformance";
import TestSeo from "./pages/test/TestSeo";
import TestSecurity from "./pages/test/TestSecurity";
import TestDesign from "./pages/test/TestDesign";
import TestE2E from "./pages/test/TestE2E";
import TestAnalytics from "./pages/test/TestAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <OrganizationProvider>
            <ScrollToTop />
            <Routes>
              {/* Marketing */}
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/features" element={<Features />} />
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
              <Route path="/docs" element={<Docs />} />
              <Route path="/docs/:audience" element={<DocsAudience />} />
              <Route path="/docs/:audience/:slug" element={<DocsArticle />} />
              <Route path="/launch" element={<Launch />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/return" element={<CheckoutReturn />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/newsletter/confirm" element={<NewsletterConfirm />} />
              <Route path="/use-template/lovable" element={<UseTemplateLovable />} />
              <Route path="/use-template/github" element={<UseTemplateGithub />} />

              {/* QA / Launch readiness — /test */}
              <Route path="/test" element={<TestShell />}>
                <Route index element={<TestIndex />} />
                <Route path="accessibility" element={<TestAccessibility />} />
                <Route path="performance" element={<TestPerformance />} />
                <Route path="seo" element={<TestSeo />} />
                <Route path="security" element={<TestSecurity />} />
                <Route path="design" element={<TestDesign />} />
                <Route path="e2e" element={<TestE2E />} />
                <Route path="analytics" element={<TestAnalytics />} />
              </Route>

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
                path="/dashboard/organization/sso"
                element={
                  <ProtectedRoute>
                    <OrgSso />
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
              <Route
                path="/dashboard/settings/security"
                element={<ProtectedRoute><DashboardSecurity /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/settings/api-keys"
                element={<ProtectedRoute><DashboardApiKeys /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/settings/webhooks"
                element={<ProtectedRoute><DashboardWebhooks /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/settings/data"
                element={<ProtectedRoute><DashboardData /></ProtectedRoute>}
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
                path="/admin/seo"
                element={
                  <ProtectedRoute>
                    <AdminSeo />
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
              <Route
                path="/admin/brand"
                element={
                  <ProtectedRoute>
                    <AdminBrand />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
              <Route path="/admin/blog/new" element={<ProtectedRoute><AdminBlogEditor /></ProtectedRoute>} />
              <Route path="/admin/blog/:id" element={<ProtectedRoute><AdminBlogEditor /></ProtectedRoute>} />
              <Route path="/admin/status" element={<ProtectedRoute><AdminStatus /></ProtectedRoute>} />
              <Route path="/admin/about" element={<ProtectedRoute><AdminAbout /></ProtectedRoute>} />



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
