import "./index.css";
import { Composition } from "remotion";
import { BerryStylishVideo } from "./BerryStylishVideo";

// Total: 150 + 210 + 180 - 20 - 20 = 500 frames
const TOTAL_DURATION = 500;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BerryStylishVideo"
        component={BerryStylishVideo}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
