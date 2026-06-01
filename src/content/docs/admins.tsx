import { P, H2, UL, OL, A, Note, Prose, Code } from "@/components/docs/prose";

export const adminsContent: Record<string, () => JSX.Element> = {
  roles: () => (
    <Prose>
      <P>Every member of an organization has exactly one role. Roles control what they can see and change inside the workspace.</P>
      <H2>The three roles</H2>
      <UL>
        <li><strong>Owner</strong> — full control. Can change billing, transfer ownership, and delete the workspace. There must always be at least one owner.</li>
        <li><strong>Admin</strong> — can invite, remove, and re-role members, and edit workspace settings, but can't change billing or delete the workspace.</li>
        <li><strong>Member</strong> — can use the product but can't change workspace settings, billing, or membership.</li>
      </UL>
      <Note>Roles are scoped per workspace. A user can be an owner in one workspace and a member in another at the same time.</Note>
    </Prose>
  ),

  "workspace-branding": () => (
    <Prose>
      <P>Owners and admins can rename the workspace and upload a logo. These appear in the dashboard header, in emails, and on invitations.</P>
      <OL>
        <li>Open <A to="/dashboard/organization">Dashboard → Organization</A>.</li>
        <li>Edit the workspace name, slug, and upload a square logo (PNG or SVG, ≥ 256×256).</li>
        <li>Click <strong>Save</strong>. Changes apply immediately for every member.</li>
      </OL>
    </Prose>
  ),

  "invite-teammates": () => (
    <Prose>
      <P>Invite teammates by email. Each invite is a unique single-use link that expires after 7 days.</P>
      <OL>
        <li>Open <A to="/dashboard/members">Dashboard → Members</A>.</li>
        <li>Click <strong>Invite</strong>, enter one or more email addresses, and pick a role (Member or Admin).</li>
        <li>Recipients get an email with an accept link. Pending invites show up under <A to="/dashboard/invitations">Invitations</A> until accepted.</li>
      </OL>
      <Note>Invitations are bound to the email address they're sent to. To switch addresses, revoke the invite and send a new one.</Note>
    </Prose>
  ),

  "manage-roles": () => (
    <Prose>
      <P>You can change a member's role at any time. Members are notified by email when their role changes.</P>
      <OL>
        <li>Open <A to="/dashboard/members">Members</A>.</li>
        <li>Click the role badge next to a member's name and pick a new role.</li>
        <li>To transfer ownership, promote another member to Owner — your role automatically drops to Admin.</li>
      </OL>
    </Prose>
  ),

  "remove-members": () => (
    <Prose>
      <P>Removing a member revokes their access immediately. Any content they own inside the workspace stays with the workspace.</P>
      <OL>
        <li>Open <A to="/dashboard/members">Members</A>.</li>
        <li>Click the menu next to the member and choose <strong>Remove from workspace</strong>.</li>
        <li>Confirm. They'll be signed out of this workspace on their next request.</li>
      </OL>
    </Prose>
  ),

  "pending-invites": () => (
    <Prose>
      <P>Pending invitations are listed under <A to="/dashboard/invitations">Dashboard → Invitations</A>. From there you can:</P>
      <UL>
        <li><strong>Resend</strong> — generates a fresh email with a new accept link.</li>
        <li><strong>Revoke</strong> — invalidates the link so it can no longer be accepted.</li>
        <li><strong>Copy link</strong> — useful for sharing via Slack or another channel.</li>
      </UL>
    </Prose>
  ),

  "choose-plan": () => (
    <Prose>
      <P>Plans are managed at the workspace level. Owners choose and change plans from billing.</P>
      <OL>
        <li>Open <A to="/pricing">/pricing</A> to compare plans, or go straight to <A to="/dashboard/billing">Dashboard → Billing</A>.</li>
        <li>Click <strong>Choose plan</strong> on the tier you want. You'll see a plan-review dialog summarizing what's included.</li>
        <li>Continue to <A to="/checkout">/checkout</A> to enter your payment method. Annual plans receive an automatic discount.</li>
      </OL>
      <H2>Trials</H2>
      <P>Some plans include a free trial. You won't be charged until the trial ends — cancel anytime in the customer portal.</P>
    </Prose>
  ),

  "payment-method": () => (
    <Prose>
      <P>Update your card, billing address, tax ID, or download invoices from the secure customer portal.</P>
      <OL>
        <li>Open <A to="/dashboard/billing">Dashboard → Billing</A>.</li>
        <li>Click <strong>Manage subscription</strong>. You'll be redirected to the hosted billing portal.</li>
        <li>Update your card or tax info, then click <strong>Return</strong> to come back to the dashboard.</li>
      </OL>
      <Note>Only workspace owners see the <strong>Manage subscription</strong> button. Admins and members see read-only billing status.</Note>
    </Prose>
  ),

  "cancel-and-refunds": () => (
    <Prose>
      <H2>Cancel a subscription</H2>
      <OL>
        <li>Open the billing portal from <A to="/dashboard/billing">Dashboard → Billing</A>.</li>
        <li>Click <strong>Cancel plan</strong>. You'll keep access until the end of the current billing period.</li>
        <li>Reactivate any time before the period ends to keep your data without interruption.</li>
      </OL>
      <H2>Refunds & proration</H2>
      <UL>
        <li>Upgrades are <strong>prorated</strong>: you're charged the difference for the remainder of the period.</li>
        <li>Downgrades take effect at the next renewal — no immediate refund.</li>
        <li>For one-off refund requests, contact support. Refunds are at the workspace owner's discretion.</li>
      </UL>
    </Prose>
  ),

  analytics: () => (
    <Prose>
      <P>The <A to="/admin/analytics">Admin → Analytics</A> dashboard shows product usage trends pulled from the built-in event pipeline.</P>
      <H2>Key views</H2>
      <UL>
        <li><strong>Active users</strong> — DAU / WAU / MAU with sparkline trends.</li>
        <li><strong>Signup funnel</strong> — visit → signup → first action → retained.</li>
        <li><strong>Top events</strong> — most-fired events grouped by name.</li>
        <li><strong>Revenue</strong> — MRR, ARR, and churn pulled from billing.</li>
      </UL>
      <P>Use the date-range picker in the header to zoom in. All charts respect your active workspace.</P>
    </Prose>
  ),

  sso: () => (
    <Prose>
      <P>SSO (SAML 2.0) lets your workspace members sign in through your identity provider — Okta, Azure AD, Google Workspace, JumpCloud, and similar.</P>
      <OL>
        <li>Open <A to="/dashboard/organization/sso">Dashboard → Organization → SSO</A>.</li>
        <li>Enter the metadata URL or upload the XML from your IdP.</li>
        <li>Map your IdP groups to roles (owner / admin / member).</li>
        <li>Test with a non-admin account, then enable enforcement to require SSO for everyone in your workspace.</li>
      </OL>
      <Note>SSO is available on Business plans and above. Existing password sessions are migrated automatically the first time a user signs in via SSO.</Note>
    </Prose>
  ),

  "audit-log": () => (
    <Prose>
      <P>The audit log records security- and admin-sensitive actions across the workspace. It's append-only and retained for 12 months on Business plans (90 days otherwise).</P>
      <H2>What's recorded</H2>
      <UL>
        <li>Sign-in, sign-out, password change, and SSO events.</li>
        <li>Invitations sent, accepted, revoked.</li>
        <li>Role changes and member removals.</li>
        <li>Billing actions (plan changes, payment method updates).</li>
        <li>Workspace settings changes.</li>
      </UL>
      <P>Open <A to="/admin/audit">Admin → Audit log</A> to filter by actor, action type, or date range. Export to CSV for offline review.</P>
    </Prose>
  ),

  compliance: () => (
    <Prose>
      <P>For an overview of our security posture, certifications, and data handling, see the <A to="/security">security page</A>. Legal documents are at <A to="/privacy">/privacy</A> and <A to="/terms">/terms</A>.</P>
      <H2>Common requests</H2>
      <UL>
        <li><strong>DPA</strong> — request a signed Data Processing Addendum from support.</li>
        <li><strong>Subprocessor list</strong> — see <A to="/security">/security</A>.</li>
        <li><strong>SOC 2 / ISO reports</strong> — under NDA, available on request.</li>
        <li><strong>Data residency</strong> — primary region is set when the workspace is created; contact support to migrate.</li>
      </UL>
    </Prose>
  ),
};
