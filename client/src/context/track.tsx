import { useWebrtcChannel } from "@/hooks/webrtc";
import * as React from "react";
import { totalLevel } from "@/lib/constants";
import { unconfigured } from "@/lib/utils";

type TrackContext = {
  track: Uint8Array;
  updateTrack: (track: Uint8Array) => void;
  level: number;
};

export const TrackContext = React.createContext<TrackContext>({
  level: 0,
  track: new Uint8Array(),
  updateTrack: unconfigured,
});

export const useTrack = () => React.useContext(TrackContext);

export default function TrackProvider({ children }: React.PropsWithChildren) {
  const [track, setTrack] = React.useState(new Uint8Array());

  const sendTrack = useWebrtcChannel("track", setTrack);

  const updateTrack = React.useCallback(
    (track: Uint8Array) => {
      sendTrack(track);
      setTrack(track);
    },
    [sendTrack]
  );

  // Esc click handler
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setTrack((track) => {
        if (e.key !== "Escape" || track.length === 0) return track;
        const newTrack = track.slice(0, -1);
        sendTrack(newTrack);
        return newTrack;
      });
    };
    window.addEventListener("keyup", handler);
    return () => window.removeEventListener("keyup", handler);
  }, [sendTrack]);

  return (
    <TrackContext.Provider
      value={{ track, updateTrack, level: totalLevel - track.length }}
    >
      {children}
    </TrackContext.Provider>
  );
}
