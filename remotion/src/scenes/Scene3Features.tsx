import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";

const features = [
  { icon: "🔒", title: "Auth", desc: "Email, Google, Apple, OTP", color: theme.primary },
  { icon: "💳", title: "Billing", desc: "Stripe, trials, portal", color: theme.secondary },
  { icon: "✉️", title: "Emails", desc: "Branded transactional", color: theme.accent },
  { icon: "👥", title: "Teams", desc: "Orgs, roles, invites", color: theme.success },
  { icon: "📊", title: "Analytics", desc: "MRR, churn, retention", color: theme.primary },
  { icon: "🛡️", title: "Secure", desc: "RLS, audit, hardened", color: theme.secondary },
];

export const Scene3Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = spring({ frame, fps, config: { damping: 20, stiffness: 160 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 100 }}>
      <h2
        style={{
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [20, 0])}px)`,
          fontFamily: "Sora, sans-serif",
          fontSize: 78,
          fontWeight: 700,
          color: theme.fg,
          margin: 0,
          marginBottom: 50,
          letterSpacing: -2,
        }}
      >
        Everything included.
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          width: 1500,
        }}
      >
        {features.map((f, i) => {
          const s = spring({
            frame: frame - 14 - i * 6,
            fps,
            config: { damping: 16, stiffness: 180 },
          });
          return (
            <div
              key={f.title}
              style={{
                opacity: s,
                transform: `scale(${interpolate(s, [0, 1], [0.85, 1])}) translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 24,
                padding: 36,
                boxShadow: "0 4px 16px -2px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  background: f.color + "22",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 38,
                  marginBottom: 20,
                }}
              >
                {f.icon}
              </div>
              <div
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 36,
                  fontWeight: 700,
                  color: theme.fg,
                  marginBottom: 6,
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 22,
                  color: theme.muted,
                }}
              >
                {f.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
