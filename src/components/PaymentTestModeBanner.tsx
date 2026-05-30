import { DismissibleNotice } from "@/components/marketing/DismissibleNotice";

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;

export function PaymentTestModeBanner() {
  if (!clientToken?.startsWith("pk_test_")) return null;
  return (
    <DismissibleNotice
      id="payments-test-mode"
      tone="warning"
      variant="banner"
      title="Test mode is on"
      actions={
        <a
          href="https://docs.lovable.dev/features/payments#test-and-live-environments"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium text-warning hover:text-warning/80"
        >
          Read more
        </a>
      }
    >
      All payments made in the preview are in test mode — no real charges will occur.
    </DismissibleNotice>
  );
}
