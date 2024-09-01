import { useWebrtcChannel } from "@/hooks/webrtc";
import * as React from "react";
import { useGameState } from "./gameState";
import { getUpdatedState, isValidTrackToSelect } from "@/lib/gameLogic";

type SelectHandler = (index: number[]) => void;

type TrackContext = {
  track: Uint8Array;
  set: SelectHandler;
  unset: SelectHandler;
  level: number;
};

export const TrackContext = React.createContext<TrackContext>({
  level: 0,
  track: new Uint8Array(),
  set: () => {
    throw "Track context not configured";
  },
  unset: () => {
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

  const sendSetSignal = useWebrtcChannel(
    "set-signal",
    React.useCallback(
      (track) => {
        setOther((state) => getUpdatedState(state, track, true));
      },
      [setOther]
    )
  );

  const sendUnSetSignal = useWebrtcChannel(
    "unset-signal",
    React.useCallback(
      (track) => {
        setOther((state) => getUpdatedState(state, track, false));
      },
      [setOther]
    )
  );

  const sendTrack = useWebrtcChannel("track", setTrack);

  const handleSelect = React.useCallback(
    (buf: number[], isSet: boolean) => {
      let newTrack = new Uint8Array(track.length + 1);
      newTrack.set(track);
      newTrack[track.length] = buf[0];

      if (newTrack.length === totalLevel) {
        if (!isValidTrackToSelect(newTrack, mine, other) && isSet) {
          return;
        }

        if (isSet) {
          sendSetSignal(newTrack);
        } else {
          sendUnSetSignal(newTrack);
        }

        setMine(getUpdatedState(mine, newTrack, isSet));
        newTrack = new Uint8Array();
      }

      setTrack(newTrack);
      sendTrack(newTrack);
    },
    [
      mine,
      other,
      track,
      sendTrack,
      sendSetSignal,
      sendUnSetSignal,
      setMine,
      totalLevel,
    ]
  );

  const set: SelectHandler = React.useCallback(
    (buf) => handleSelect(buf, true),
    [handleSelect]
  );

  const unset: SelectHandler = React.useCallback(
    (buf) => handleSelect(buf, false),
    [handleSelect]
  );

  // Esc click handler
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setTrack((track) => {
        if (e.key !== "Escape" || track.length === 0) return track;
        const newTrack = track.slice(0, -1);
        sendSetSignal(newTrack);
        return newTrack;
      });
    };
    window.addEventListener("keyup", handler);
    return () => window.removeEventListener("keyup", handler);
  }, [sendSetSignal]);

  return (
    <TrackContext.Provider
      value={{ track, set, unset, level: totalLevel - track.length }}
    >
      {children}
    </TrackContext.Provider>
  );
}
