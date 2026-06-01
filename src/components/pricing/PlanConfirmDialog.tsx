import { Check, ShieldCheck, Sparkles, CreditCard, Settings2, ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface PlanConfirmTier {
  name: string;
  description: string;
  monthly: number;
  yearly: number;
  highlight?: boolean;
  features: string[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: PlanConfirmTier | null;
  yearly: boolean;
  userEmail?: string | null;
  onConfirm: () => void;
}

export function PlanConfirmDialog({ open, onOpenChange, tier, yearly, userEmail, onConfirm }: Props) {
  if (!tier) return null;

  const unit = yearly ? tier.yearly : tier.monthly;
  const annualTotal = tier.yearly * 12;
  const monthlyAnnual = tier.monthly * 12;
  const annualSavings = Math.max(0, monthlyAnnual - annualTotal);
  const cadenceLabel = yearly ? "Yearly" : "Monthly";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="grid md:grid-cols-5">
          {/* Order summary */}
          <div className="md:col-span-3 p-6 md:p-8 bg-card">
            <DialogHeader className="text-left space-y-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-2xl">Review your plan</DialogTitle>
                {tier.highlight && (
                  <Badge className="gradient-primary text-primary-foreground border-0">Most popular</Badge>
                )}
              </div>
              <DialogDescription>
                Confirm what you're subscribing to before we open secure payment.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 rounded-lg border border-border bg-background p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Plan</p>
                  <p className="text-lg font-semibold">{tier.name}</p>
                </div>
                <Badge variant="outline" className="rounded-full">{cadenceLabel}</Badge>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">${unit}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              {yearly ? (
                <div className="mt-1 text-sm text-muted-foreground">
                  Billed <span className="font-medium text-foreground">${annualTotal}</span> annually
                  {annualSavings > 0 && (
                    <span className="ml-2 text-success">· Save ${annualSavings}/year</span>
                  )}
                </div>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">Billed monthly · cancel anytime</p>
              )}

              <div className="mt-5 border-t border-border pt-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">What's included</p>
                <ul className="space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {userEmail && (
                <div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
                  Subscribing as <span className="font-medium text-foreground">{userEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Trust & action */}
          <div className="md:col-span-2 p-6 md:p-8 bg-muted/40 border-t md:border-t-0 md:border-l border-border flex flex-col">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">What happens next</p>
            <ol className="mt-3 space-y-3">
              <Step icon={<CreditCard className="h-4 w-4" />} title="Secure payment" body="Enter your card on a secure Stripe-powered form." />
              <Step icon={<Sparkles className="h-4 w-4" />} title="Instant access" body={`${tier.name} features unlock the moment payment clears.`} />
              <Step icon={<Settings2 className="h-4 w-4" />} title="Manage anytime" body="Upgrade, downgrade or cancel from Billing." />
            </ol>

            <ul className="mt-6 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-success" /> Cancel anytime — no contract</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-success" /> Prorated upgrades & downgrades</li>
              <li className="flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-success" /> Payments secured by Stripe</li>
            </ul>

            <div className="mt-auto pt-6 space-y-3">
              <Button onClick={onConfirm} className={cn("w-full", tier.highlight && "shadow-glow")}>
                Continue to payment
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <p className="text-[11px] leading-relaxed text-muted-foreground text-center">
                By continuing you agree to our{" "}
                <Link to="/terms" className="underline">Terms</Link> and{" "}
                <Link to="/privacy" className="underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Step({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 h-7 w-7 rounded-full bg-background border border-border flex items-center justify-center text-primary shrink-0">
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}
