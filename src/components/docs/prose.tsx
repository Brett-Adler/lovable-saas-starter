import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export const P = ({ children }: { children: ReactNode }) => (
  <p className="text-foreground/85 leading-relaxed">{children}</p>
);

export const H2 = ({ children, id }: { children: ReactNode; id?: string }) => (
  <h2 id={id} className="mt-10 mb-3 text-xl md:text-2xl font-semibold tracking-tight scroll-mt-24">
    {children}
  </h2>
);

export const H3 = ({ children, id }: { children: ReactNode; id?: string }) => (
  <h3 id={id} className="mt-6 mb-2 text-base font-semibold text-foreground scroll-mt-24">
    {children}
  </h3>
);

export const UL = ({ children }: { children: ReactNode }) => (
  <ul className="list-disc pl-6 space-y-1.5 text-foreground/85 marker:text-muted-foreground">
    {children}
  </ul>
);

export const OL = ({ children }: { children: ReactNode }) => (
  <ol className="list-decimal pl-6 space-y-1.5 text-foreground/85 marker:text-muted-foreground">
    {children}
  </ol>
);

export const Code = ({ children }: { children: ReactNode }) => (
  <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-[0.875em] font-mono font-medium break-words">
    {children}
  </code>
);

export const A = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="text-primary hover:underline">{children}</Link>
);

export const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer external"
    className="inline-flex items-center gap-1 text-primary hover:underline"
  >
    {children}
    <ExternalLink className="h-3 w-3" aria-hidden="true" />
    <span className="sr-only"> (opens in new tab)</span>
  </a>
);

export const Note = ({ children }: { children: ReactNode }) => (
  <div className="my-4 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm text-foreground/85">
    {children}
  </div>
);

export const Prose = ({ children }: { children: ReactNode }) => (
  <div className="space-y-4">{children}</div>
);
