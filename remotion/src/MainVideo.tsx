import { AbsoluteFill } from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

import { PersistentBackground } from "./components/PersistentBackground";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Features } from "./scenes/Scene3Features";
import { Scene4Stats } from "./scenes/Scene4Stats";
import { Scene5Close } from "./scenes/Scene5Close";

loadSora("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

// Scene durations (before transitions overlap-subtract)
const S1 = 90;   // 3.0s hook
const S2 = 130;  // 4.3s problem
const S3 = 130;  // 4.3s features
const S4 = 110;  // 3.7s stats
const S5 = 120;  // 4.0s close
const TRANS = 18; // 0.6s crossfade, 4 of them

// Total = 90 + 130 + 130 + 110 + 120 - 4*18 = 580 - 72 = 508
export const TOTAL_FRAMES = S1 + S2 + S3 + S4 + S5 - 4 * TRANS;

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <PersistentBackground />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={S1}>
          <Scene1Hook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANS })} />
        <TransitionSeries.Sequence durationInFrames={S2}>
          <Scene2Problem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANS })} />
        <TransitionSeries.Sequence durationInFrames={S3}>
          <Scene3Features />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANS })} />
        <TransitionSeries.Sequence durationInFrames={S4}>
          <Scene4Stats />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANS })} />
        <TransitionSeries.Sequence durationInFrames={S5}>
          <Scene5Close />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
