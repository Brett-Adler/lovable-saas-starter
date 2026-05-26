// Shared brand styles for SaaS Starter auth emails.
// Mirrors src/index.css tokens: --primary 14 95% 60%, --radius 0.875rem, Inter font.

export const FONT_FAMILY =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"

export const main = {
  backgroundColor: '#ffffff',
  fontFamily: FONT_FAMILY,
  margin: 0,
  padding: 0,
}

export const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '40px 32px',
}

export const brand = {
  fontSize: '14px',
  fontWeight: 700 as const,
  color: '#f5532d',
  letterSpacing: '-0.01em',
  margin: '0 0 32px',
  textTransform: 'uppercase' as const,
}

export const h1 = {
  fontFamily: "'Sora', " + FONT_FAMILY,
  fontSize: '26px',
  fontWeight: 700 as const,
  color: '#1f1f2e',
  lineHeight: '1.25',
  letterSpacing: '-0.02em',
  margin: '0 0 20px',
}

export const text = {
  fontSize: '15px',
  color: '#5a5a6e',
  lineHeight: '1.6',
  margin: '0 0 24px',
}

export const link = {
  color: '#f5532d',
  textDecoration: 'underline',
}

export const button = {
  display: 'inline-block',
  backgroundColor: '#f5532d',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 600 as const,
  borderRadius: '14px',
  padding: '14px 28px',
  textDecoration: 'none',
  margin: '8px 0 32px',
}

export const codeBlock = {
  display: 'inline-block',
  fontFamily: "'SFMono-Regular', Menlo, Consolas, monospace",
  fontSize: '28px',
  fontWeight: 700 as const,
  color: '#1f1f2e',
  backgroundColor: '#fff1ec',
  borderRadius: '14px',
  padding: '16px 28px',
  letterSpacing: '0.2em',
  margin: '0 0 32px',
}

export const footer = {
  fontSize: '13px',
  color: '#9a9aa8',
  lineHeight: '1.6',
  margin: '32px 0 0',
  borderTop: '1px solid #f0eef0',
  paddingTop: '20px',
}
