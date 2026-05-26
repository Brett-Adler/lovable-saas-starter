import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PasswordSchema = z
  .object({
    current_password: z.string().min(1, "Required"),
    new_password: z.string().min(8, "At least 8 characters").max(128),
    confirm: z.string(),
  })
  .refine((v) => v.new_password === v.confirm, { path: ["confirm"], message: "Passwords do not match" });

const EmailSchema = z.object({ email: z.string().email() });

export const SecurityTab = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const pwForm = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: { current_password: "", new_password: "", confirm: "" },
  });

  const emailForm = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: { email: user?.email ?? "" },
  });

  const onPasswordSubmit = async (v: z.infer<typeof PasswordSchema>) => {
    if (!user?.email) return;
    const { error: reauthErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: v.current_password,
    });
    if (reauthErr) {
      pwForm.setError("current_password", { message: "Incorrect current password" });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: v.new_password });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    pwForm.reset({ current_password: "", new_password: "", confirm: "" });
  };

  const onEmailSubmit = async (v: z.infer<typeof EmailSchema>) => {
    if (v.email === user?.email) {
      toast.info("That's already your email.");
      return;
    }
    const { error } = await supabase.auth.updateUser(
      { email: v.email },
      { emailRedirectTo: `${window.location.origin}/dashboard/settings` },
    );
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Check both inboxes to confirm the change.");
  };

  const handleSignOutEverywhere = async () => {
    setSigningOut(true);
    const { error } = await supabase.auth.signOut({ scope: "global" });
    if (error) {
      toast.error(error.message);
      setSigningOut(false);
      return;
    }
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email address</CardTitle>
          <CardDescription>You'll need to confirm the change from both inboxes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" autoComplete="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" variant="outline" disabled={emailForm.formState.isSubmitting}>
                  {emailForm.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Send confirmation
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Use at least 8 characters. We'll re-verify your current password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...pwForm}>
            <form onSubmit={pwForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={pwForm.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl><Input type="password" autoComplete="current-password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={pwForm.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl><Input type="password" autoComplete="new-password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={pwForm.control}
                  name="confirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm new password</FormLabel>
                      <FormControl><Input type="password" autoComplete="new-password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={pwForm.formState.isSubmitting}>
                  {pwForm.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Update password
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
          <CardDescription>Sign out of every device and browser you've used.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleSignOutEverywhere} disabled={signingOut}>
            {signingOut && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign out everywhere
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
