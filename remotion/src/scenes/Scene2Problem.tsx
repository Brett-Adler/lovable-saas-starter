import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";

const tasks = [
  "Build authentication",
  "Wire up Stripe billing",
  "Design transactional emails",
  "Set up teams & roles",
  "Build admin analytics",
];

export const Scene2Problem: React.FC = () => {
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
          fontSize: 84,
          fontWeight: 700,
          color: theme.fg,
          margin: 0,
          marginBottom: 60,
          letterSpacing: -2,
        }}
      >
        Skip the boring stuff.
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 900 }}>
        {tasks.map((t, i) => {
          const enter = spring({
            frame: frame - 18 - i * 8,
            fps,
            config: { damping: 22, stiffness: 180 },
          });
          // Strike-through starts after last has entered
          const strikeStart = 18 + tasks.length * 8 + 4 + i * 6;
          const strike = interpolate(frame, [strikeStart, strikeStart + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const fade = interpolate(strike, [0.4, 1], [1, 0.35]);
          return (
            <div
              key={t}
              style={{
                opacity: enter * fade,
                transform: `translateX(${interpolate(enter, [0, 1], [-40, 0])}px)`,
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 18,
                padding: "22px 28px",
                display: "flex",
                alignItems: "center",
                gap: 20,
                fontFamily: "Inter, sans-serif",
                fontSize: 32,
                fontWeight: 500,
                color: theme.fg,
                boxShadow: "0 2px 8px -2px rgba(0,0,0,0.05)",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 999,
                  background: strike > 0.3 ? theme.success : theme.muted + "33",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  transition: "none",
                }}
              >
                {strike > 0.3 ? "✓" : ""}
              </div>
              <span
                style={{
                  textDecoration: strike > 0.5 ? "line-through" : "none",
                  textDecorationColor: theme.primary,
                  textDecorationThickness: 3,
                }}
              >
                {t}
              </span>
              <div
                style={{
                  position: "absolute",
                  right: 28,
                  fontSize: 18,
                  color: theme.success,
                  fontWeight: 700,
                  opacity: strike,
                  letterSpacing: 1,
                }}
              >
                DONE
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
