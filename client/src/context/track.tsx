import { useWebrtcChannel } from "@/hooks/webrtc";
import * as React from "react";
import { getUpdatedState, useGameState } from "./gameState";

export type SelectHandler = (index: number[]) => void;

type TrackContext = {
  track: Uint8Array;
  handleSelect: SelectHandler;
};

export const TrackContext = React.createContext<TrackContext>({
  track: new Uint8Array(),
  handleSelect: () => {
    throw "Track context not configured";
  },
});

export const useTrack = () => React.useContext(TrackContext);

type TrackProviderProps = { totalLevel: number };
export default function TrackProvider({
  totalLevel,
  children,
}: React.PropsWithChildren<TrackProviderProps>) {
  const [track, setTrack] = React.useState(new Uint8Array());
  const { mine, other, setMine, setOther } = useGameState();

  const sendTrack = useWebrtcChannel(
    "movement",
    React.useCallback(
      (data) => {
        if (data.length === totalLevel) {
          setOther((otherState) => getUpdatedState(otherState, mine, data));
          setTrack(new Uint8Array());
        } else {
          setTrack(data);
        }
      },
      [mine, setOther, totalLevel]
    )
  );

  const handleSelect: SelectHandler = React.useCallback(
    (buf) => {
      const newTrack = new Uint8Array(track.length + 1);
      newTrack[0] = buf[0];
      newTrack.set(track, 1);
      sendTrack(newTrack);
      if (newTrack.length === totalLevel) {
        setMine((myState) => getUpdatedState(myState, other, newTrack));
        setTrack(new Uint8Array());
      } else {
        setTrack(newTrack);
      }
    },
    [other, sendTrack, setMine, totalLevel, track]
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
    <TrackContext.Provider value={{ track, handleSelect }}>
      {children}
    </TrackContext.Provider>
  );
}
