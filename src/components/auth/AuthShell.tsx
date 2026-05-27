import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { NoIndex } from "@/components/seo/NoIndex";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const AuthShell = ({ title, subtitle, footer, children }: AuthShellProps) => (
  <>
    <NoIndex />
    <div className="min-h-screen flex flex-col">
      <header className="container py-6">
        <Logo />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{title}</h1>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
            {children}
          </div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
      <footer className="container py-6 text-center text-xs text-muted-foreground">
        <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
        <span className="mx-2">·</span>
        <Link to="/terms" className="hover:text-foreground">Terms</Link>
      </footer>
    </div>
  </>
);
