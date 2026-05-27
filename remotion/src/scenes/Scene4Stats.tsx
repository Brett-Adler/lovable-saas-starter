import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";

const stats = [
  { value: "14", suffix: "-day", label: "Free trial" },
  { value: "8+", suffix: "", label: "Features wired up" },
  { value: "0", suffix: " setup", label: "Just replace branding" },
];

export const Scene4Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = spring({ frame, fps, config: { damping: 20, stiffness: 160 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 120 }}>
      <h2
        style={{
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [20, 0])}px)`,
          fontFamily: "Sora, sans-serif",
          fontSize: 78,
          fontWeight: 700,
          color: theme.fg,
          margin: 0,
          marginBottom: 70,
          letterSpacing: -2,
          textAlign: "center",
        }}
      >
        Days, not months.
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, width: 1500 }}>
        {stats.map((s, i) => {
          const enter = spring({
            frame: frame - 14 - i * 10,
            fps,
            config: { damping: 14, stiffness: 180 },
          });
          return (
            <div
              key={s.label}
              style={{
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 28,
                padding: 50,
                textAlign: "center",
                boxShadow: "0 8px 32px -8px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 140,
                  fontWeight: 800,
                  lineHeight: 1,
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryGlow})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  letterSpacing: -4,
                }}
              >
                {s.value}
                <span style={{ fontSize: 60 }}>{s.suffix}</span>
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 28,
                  color: theme.muted,
                  marginTop: 10,
                }}
              >
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
