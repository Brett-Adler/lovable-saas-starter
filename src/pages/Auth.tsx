import { Link } from "react-router-dom";
import { Mail, KeyRound, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/AuthShell";

const Auth = ({ mode = "login" }: { mode?: "login" | "signup" }) => {
  const isLogin = mode === "login";
  return (
    <AuthShell
      title={isLogin ? "Welcome back" : "Create your account"}
      subtitle={isLogin ? "Log in to continue" : "Start your 14-day free trial"}
      footer={
        isLogin ? (
          <>Don't have an account? <Link to="/signup" className="text-primary font-medium">Sign up</Link></>
        ) : (
          <>Already have an account? <Link to="/login" className="text-primary font-medium">Log in</Link></>
        )
      }
    >
      <div className="space-y-3">
        <Button variant="outline" className="w-full h-11 justify-start gap-3" disabled>
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.32z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.85 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.67-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.67 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full h-11 justify-start gap-3" disabled>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
          Continue with Apple
        </Button>
        <Button variant="outline" className="w-full h-11 justify-start gap-3" asChild>
          <Link to="/login/phone"><Smartphone className="h-5 w-5" />Continue with phone</Link>
        </Button>
      </div>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">or</span>
        </div>
      </div>
      <Button className="w-full h-11 gap-2" asChild>
        <Link to={isLogin ? "/login/email" : "/signup/email"}>
          <Mail className="h-4 w-4" /> Continue with email
        </Link>
      </Button>
      <p className="mt-4 text-xs text-center text-muted-foreground">
        By continuing you agree to our <Link to="/terms" className="underline">Terms</Link> and{" "}
        <Link to="/privacy" className="underline">Privacy Policy</Link>.
      </p>
      <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/40 text-xs text-muted-foreground flex gap-2">
        <KeyRound className="h-4 w-4 shrink-0 mt-0.5" />
        <p>OAuth providers and full email auth flow are wired up in Phase 3 of the build.</p>
      </div>
    </AuthShell>
  );
};

export default Auth;
