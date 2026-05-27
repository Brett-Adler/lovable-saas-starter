import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { AppleButton } from "@/components/auth/AppleButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const emailSchema = z.string().trim().email({ message: "Invalid email address" }).max(255);
const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(128, { message: "Password must be less than 128 characters" });
const nameSchema = z.string().trim().min(1, { message: "Name is required" }).max(100);
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{6,14}$/, {
    message: "Use E.164 format, e.g. +14155552671",
  });

const Auth = ({ mode = "login" }: { mode?: "login" | "signup" }) => {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Phone / OTP state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  const nextParam = new URLSearchParams(location.search).get("next");
  const from =
    nextParam ??
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    "/dashboard";

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedEmail = emailSchema.parse(email);
      const validatedPassword = passwordSchema.parse(password);
      const validatedName = isLogin ? null : nameSchema.parse(displayName);

      setLoading(true);

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: validatedEmail,
          password: validatedPassword,
        });
        if (error) throw error;
        toast({ title: "Welcome back!" });
        navigate(from, { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({
          email: validatedEmail,
          password: validatedPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: validatedName },
          },
        });
        if (error) throw error;
        supabase.functions
          .invoke("send-transactional-email", {
            body: {
              templateName: "welcome",
              recipientEmail: validatedEmail,
              idempotencyKey: `welcome-${validatedEmail}`,
              templateData: { name: validatedName },
            },
          })
          .catch((e) => console.warn("welcome email failed", e));
        toast({
          title: "Account created",
          description: "You're all set — welcome aboard!",
        });
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      const message =
        err instanceof z.ZodError
          ? err.errors[0]?.message ?? "Please check your input"
          : err instanceof Error
            ? err.message
            : "Something went wrong";
      toast({ title: isLogin ? "Sign-in failed" : "Sign-up failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    try {
      const validatedPhone = phoneSchema.parse(phone);
      setPhoneLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone: validatedPhone,
        options: { shouldCreateUser: !isLogin },
      });
      if (error) throw error;
      setOtpSent(true);
      toast({ title: "Code sent", description: `We texted a 6-digit code to ${validatedPhone}.` });
    } catch (err) {
      const message =
        err instanceof z.ZodError
          ? err.errors[0]?.message ?? "Invalid phone"
          : err instanceof Error
            ? err.message
            : "Failed to send code";
      toast({ title: "Couldn't send code", description: message, variant: "destructive" });
    } finally {
      setPhoneLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      if (otp.length !== 6) throw new Error("Enter the 6-digit code");
      setPhoneLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneSchema.parse(phone),
        token: otp,
        type: "sms",
      });
      if (error) throw error;
      toast({ title: "Signed in" });
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed";
      toast({ title: "Verification failed", description: message, variant: "destructive" });
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <AuthShell
      title={isLogin ? "Welcome back" : "Create your account"}
      subtitle={isLogin ? "Log in to continue" : "Start your 14-day free trial"}
      footer={
        isLogin ? (
          <>
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">
              Log in
            </Link>
          </>
        )
      }
    >
      <div className="space-y-3">
        <GoogleButton />
        <AppleButton />
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">or</span>
        </div>
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ada Lovelace"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLogin ? "Log in" : "Create account"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="phone">
          {!otpSent ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+14155552671"
                />
                <p className="text-xs text-muted-foreground">
                  Include country code (E.164). Standard SMS rates may apply.
                </p>
              </div>
              <Button onClick={sendOtp} className="w-full h-11" disabled={phoneLoading}>
                {phoneLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send code
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Enter the 6-digit code</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Sent to {phone}.{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                  >
                    Change number
                  </button>
                </p>
              </div>
              <Button onClick={verifyOtp} className="w-full h-11" disabled={phoneLoading || otp.length !== 6}>
                {phoneLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Verify and continue
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <p className="mt-4 text-xs text-center text-muted-foreground">
        By continuing you agree to our{" "}
        <Link to="/terms" className="underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthShell>
  );
};

export default Auth;
