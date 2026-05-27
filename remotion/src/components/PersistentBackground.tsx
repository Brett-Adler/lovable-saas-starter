import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

export const PersistentBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 60;
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {/* Mesh blobs that drift */}
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          left: `${10 + Math.sin(t) * 4}%`,
          top: `${-20 + Math.cos(t * 0.8) * 3}%`,
          background: `radial-gradient(circle, ${theme.primary}33 0%, transparent 60%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          right: `${-5 + Math.cos(t * 0.7) * 4}%`,
          top: `${10 + Math.sin(t * 0.6) * 4}%`,
          background: `radial-gradient(circle, ${theme.secondary}2e 0%, transparent 60%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          left: `${30 + Math.sin(t * 0.5) * 3}%`,
          bottom: `${-25 + Math.cos(t) * 3}%`,
          background: `radial-gradient(circle, ${theme.accent}2a 0%, transparent 60%)`,
          filter: "blur(40px)",
        }}
      />
    </AbsoluteFill>
  );
};
