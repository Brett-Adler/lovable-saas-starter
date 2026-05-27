import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badge = spring({ frame, fps, config: { damping: 18, stiffness: 180 } });
  const l1 = spring({ frame: frame - 8, fps, config: { damping: 20, stiffness: 160 } });
  const l2 = spring({ frame: frame - 22, fps, config: { damping: 20, stiffness: 160 } });
  const sub = spring({ frame: frame - 40, fps, config: { damping: 22, stiffness: 140 } });

  const accentScale = spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 200 } });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
      }}
    >
      <div
        style={{
          opacity: badge,
          transform: `translateY(${interpolate(badge, [0, 1], [20, 0])}px)`,
          padding: "10px 22px",
          borderRadius: 999,
          background: "#ffffffd9",
          border: `1px solid ${theme.border}`,
          fontFamily: "Inter, sans-serif",
          fontSize: 22,
          fontWeight: 600,
          color: theme.fg,
          marginBottom: 40,
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 4px 16px -2px rgba(0,0,0,0.06)",
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 999, background: theme.primary }} />
        The complete SaaS starter
      </div>

      <h1
        style={{
          fontFamily: "Sora, Inter, sans-serif",
          fontSize: 168,
          lineHeight: 1.02,
          fontWeight: 800,
          color: theme.fg,
          textAlign: "center",
          margin: 0,
          letterSpacing: -4,
        }}
      >
        <div
          style={{
            opacity: l1,
            transform: `translateY(${interpolate(l1, [0, 1], [40, 0])}px)`,
          }}
        >
          Build your SaaS in{" "}
          <span
            style={{
              display: "inline-block",
              transform: `scale(${interpolate(accentScale, [0, 1], [0.6, 1])})`,
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryGlow})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            days
          </span>
          ,
        </div>
        <div
          style={{
            opacity: l2,
            transform: `translateY(${interpolate(l2, [0, 1], [40, 0])}px)`,
          }}
        >
          not months.
        </div>
      </h1>

      <p
        style={{
          opacity: sub,
          transform: `translateY(${interpolate(sub, [0, 1], [20, 0])}px)`,
          fontFamily: "Inter, sans-serif",
          fontSize: 34,
          color: theme.muted,
          marginTop: 40,
          maxWidth: 1100,
          textAlign: "center",
        }}
      >
        Auth, payments, emails, teams — already wired up.
      </p>
    </AbsoluteFill>
  );
};
