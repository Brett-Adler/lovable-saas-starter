import { P, H2, UL, OL, A, Note, Prose, Code } from "@/components/docs/prose";

export const usersContent: Record<string, () => JSX.Element> = {
  "create-account": () => (
    <Prose>
      <P>Create an account in under a minute to start using the product. You can sign up with your email and a password, or with a single click using Google or Apple if your workspace allows it.</P>
      <H2>Sign up steps</H2>
      <OL>
        <li>Go to <A to="/signup">/signup</A>.</li>
        <li>Enter your work email and choose a strong password (12+ characters recommended), or click <strong>Continue with Google</strong>.</li>
        <li>Check your inbox for a verification link and click it. You'll be signed in immediately afterward.</li>
        <li>You'll land on the dashboard. If you don't belong to a workspace yet, you'll be prompted to create one or accept a pending invitation.</li>
      </OL>
      <Note>The very first account created on a fresh deployment is automatically promoted to admin. Anyone signing up after that is a regular user until you invite them into a workspace.</Note>
    </Prose>
  ),

  "sign-in": () => (
    <Prose>
      <P>You can sign in from any device using the same credentials you signed up with. Sessions persist across browser restarts and refresh automatically in the background.</P>
      <H2>Sign in</H2>
      <OL>
        <li>Go to <A to="/login">/login</A>.</li>
        <li>Enter your email and password, or click a provider button (Google / Apple) you used to sign up.</li>
        <li>You'll be redirected to your last viewed workspace.</li>
      </OL>
      <H2>Sign out</H2>
      <P>Open your avatar menu in the top-right of the dashboard and click <strong>Sign out</strong>. This ends your session on the current device only. To sign out everywhere, see <A to="/docs/users/change-password">change your password</A> — rotating your password invalidates all other sessions.</P>
    </Prose>
  ),

  "reset-password": () => (
    <Prose>
      <P>Forgot your password? You can reset it from the login page without losing any data.</P>
      <OL>
        <li>Click <strong>Forgot password?</strong> on <A to="/login">/login</A> (or go straight to <A to="/forgot-password">/forgot-password</A>).</li>
        <li>Enter the email address on your account.</li>
        <li>Open the email we send you and click the reset link. It's valid for one hour.</li>
        <li>Choose a new password. You'll be signed in automatically once it's saved.</li>
      </OL>
      <Note>If you don't see the email within a few minutes, check spam. The sender domain is configured by your workspace admin — see <A to="/docs/users/troubleshooting">troubleshooting</A>.</Note>
    </Prose>
  ),

  profile: () => (
    <Prose>
      <P>Your profile controls the name and avatar other teammates see across the product. Updates apply immediately to comments, audit logs, and invitations.</P>
      <H2>Edit your profile</H2>
      <OL>
        <li>Open <A to="/dashboard/settings">Dashboard → Settings</A>.</li>
        <li>Update your display name, avatar, time zone, and language.</li>
        <li>Click <strong>Save changes</strong>. Your teammates will see the new name on their next page load.</li>
      </OL>
    </Prose>
  ),

  theme: () => (
    <Prose>
      <P>The app supports light and dark themes plus a system-matching mode that follows your OS preference.</P>
      <UL>
        <li>Use the sun/moon toggle in the dashboard header to switch instantly.</li>
        <li>Choose <strong>System</strong> from the same menu to follow your OS theme — it updates live when you change OS appearance.</li>
        <li>Your preference is stored per-device and remembered across sessions.</li>
      </UL>
    </Prose>
  ),

  "what-is-an-organization": () => (
    <Prose>
      <P>An <strong>organization</strong> (or workspace) is a container for a team's data: members, billing, settings, and content all live inside it. You can belong to multiple organizations and switch between them at any time.</P>
      <H2>Common scenarios</H2>
      <UL>
        <li><strong>Solo user:</strong> create one personal organization at signup and work in it alone.</li>
        <li><strong>Team member:</strong> accept an invitation to join an existing organization. You don't need to create your own.</li>
        <li><strong>Consultant:</strong> join several client organizations and switch between them from the workspace switcher.</li>
      </UL>
      <P>Roles inside each organization (<Code>owner</Code>, <Code>admin</Code>, <Code>member</Code>) are independent — you can be an owner in one and a member in another.</P>
    </Prose>
  ),

  "accept-invite": () => (
    <Prose>
      <P>If a teammate invites you, you'll receive an email with a unique link. Clicking it adds you to that workspace.</P>
      <OL>
        <li>Open the invitation email and click <strong>Accept invitation</strong>. The link is single-use and expires after 7 days.</li>
        <li>If you already have an account, sign in. If not, you'll be prompted to create one — use the email address the invite was sent to.</li>
        <li>You'll land in the new workspace with the role your admin assigned (typically <Code>member</Code>).</li>
      </OL>
      <Note>Invitations are tied to the email address they were sent to. If you need to accept from a different email, ask your admin to resend the invite.</Note>
    </Prose>
  ),

  "switch-workspaces": () => (
    <Prose>
      <P>If you belong to more than one organization, the workspace switcher in the dashboard sidebar lets you move between them without signing out.</P>
      <OL>
        <li>Click your current workspace name at the top of the sidebar.</li>
        <li>Pick another workspace from the dropdown. The page reloads into the new context — your URL, billing, and member list all reflect the new workspace.</li>
        <li>Use <strong>Create new workspace</strong> at the bottom of the menu to spin up an additional one you own.</li>
      </OL>
    </Prose>
  ),

  notifications: () => (
    <Prose>
      <P>You can control which events trigger a notification, and whether you get them in-app, by email, or both.</P>
      <OL>
        <li>Open <A to="/dashboard/settings">Dashboard → Settings → Notifications</A>.</li>
        <li>Toggle each category (mentions, comments, billing, product updates) for the channels you prefer.</li>
        <li>Use the bell icon in the top bar to see in-app notifications. Click any item to jump to its source.</li>
      </OL>
      <P>To unsubscribe from a single marketing email, use the <strong>Unsubscribe</strong> link in the email footer — it goes to <A to="/unsubscribe">/unsubscribe</A> and takes effect immediately.</P>
    </Prose>
  ),

  "change-password": () => (
    <Prose>
      <P>You can rotate your password anytime from settings. Changing it signs you out of every other device for security.</P>
      <OL>
        <li>Open <A to="/dashboard/settings">Dashboard → Settings → Security</A>.</li>
        <li>Click <strong>Change password</strong>, enter your current password, then your new password twice.</li>
        <li>Save. You'll stay signed in here; sessions on other devices end immediately.</li>
      </OL>
    </Prose>
  ),

  "connected-providers": () => (
    <Prose>
      <P>If you signed up with Google or Apple, that account is your sign-in method. You can add or remove providers later from settings.</P>
      <UL>
        <li>Open <A to="/dashboard/settings">Dashboard → Settings → Security</A> and find <strong>Connected accounts</strong>.</li>
        <li>Click <strong>Connect</strong> next to any provider to link it. You'll be redirected to the provider to authorize.</li>
        <li>Click <strong>Disconnect</strong> to remove a provider — you'll need at least one sign-in method (provider or password) to keep your account accessible.</li>
      </UL>
    </Prose>
  ),

  "delete-account": () => (
    <Prose>
      <P>You can delete your account at any time. This is permanent.</P>
      <H2>Export your data first</H2>
      <P>Before deleting, go to <A to="/dashboard/settings">Settings → Data</A> and click <strong>Export my data</strong>. You'll get a downloadable archive of your profile, content, and audit history.</P>
      <H2>Delete</H2>
      <OL>
        <li>In Settings → Security, scroll to <strong>Delete account</strong>.</li>
        <li>Type your email to confirm and click <strong>Delete permanently</strong>.</li>
        <li>Your profile and any solo-owned workspaces are removed within 24 hours. Content owned by shared workspaces stays with the workspace.</li>
      </OL>
      <Note>If you're the only owner of a shared workspace, you'll be asked to transfer ownership first.</Note>
    </Prose>
  ),

  troubleshooting: () => (
    <Prose>
      <H2>I didn't receive my invite or magic email</H2>
      <UL>
        <li>Check spam and promotions tabs. Search for the sender domain configured by your workspace.</li>
        <li>Confirm with the sender that they used the right email address.</li>
        <li>Ask an admin to resend the invite from <Code>/dashboard/invitations</Code>.</li>
      </UL>
      <H2>I see a "Test mode" banner</H2>
      <P>That means this deployment is still pointing at sandbox payment credentials. Billing actions won't be charged. Ask your admin to flip to live credentials when ready.</P>
      <H2>Reporting a bug</H2>
      <P>Use the chat widget in the bottom-right, or email support. Include the URL you were on, what you did, and what you expected to happen. Screenshots help.</P>
    </Prose>
  ),
};
