import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";

export const Scene5Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mark = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  const tag = spring({ frame: frame - 18, fps, config: { damping: 20, stiffness: 160 } });
  const cta = spring({ frame: frame - 36, fps, config: { damping: 12, stiffness: 180 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 120 }}>
      <div
        style={{
          opacity: mark,
          transform: `scale(${interpolate(mark, [0, 1], [0.7, 1])})`,
          display: "flex",
          alignItems: "center",
          gap: 24,
          marginBottom: 50,
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: 28,
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryGlow})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 64,
            fontWeight: 800,
            fontFamily: "Sora, sans-serif",
            boxShadow: `0 12px 40px -8px ${theme.primary}66`,
          }}
        >
          ⚡
        </div>
        <div
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 88,
            fontWeight: 800,
            color: theme.fg,
            letterSpacing: -3,
          }}
        >
          SaaS Starter
        </div>
      </div>

      <div
        style={{
          opacity: tag,
          transform: `translateY(${interpolate(tag, [0, 1], [20, 0])}px)`,
          fontFamily: "Sora, sans-serif",
          fontSize: 64,
          fontWeight: 700,
          color: theme.fg,
          textAlign: "center",
          margin: 0,
          marginBottom: 50,
          letterSpacing: -2,
        }}
      >
        Replace the branding. <span style={{ color: theme.primary }}>Ship.</span>
      </div>

      <div
        style={{
          opacity: cta,
          transform: `scale(${interpolate(cta, [0, 1], [0.8, 1])})`,
          padding: "26px 50px",
          borderRadius: 999,
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryGlow})`,
          color: "white",
          fontFamily: "Inter, sans-serif",
          fontSize: 34,
          fontWeight: 700,
          boxShadow: `0 12px 40px -8px ${theme.primary}88`,
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        Start free →
      </div>
    </AbsoluteFill>
  );
};
