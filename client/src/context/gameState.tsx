import { useWebrtcChannel } from "@/hooks/webrtc";
import { totalLevel } from "@/lib/constants";
import { getIndexes, getUpdatedState, isSelected } from "@/lib/gameLogic";
import { unconfigured } from "@/lib/utils";
import * as React from "react";

type GameState = {
  mine: Uint8Array;
  other: Uint8Array;
  setMine: React.Dispatch<React.SetStateAction<Uint8Array>>;
  setOther: React.Dispatch<React.SetStateAction<Uint8Array>>;
  set: (track: Uint8Array) => void;
  unset: (track: Uint8Array) => void;
};

export const GameStateContext = React.createContext<GameState>({
  mine: new Uint8Array(),
  other: new Uint8Array(),
  setMine: unconfigured,
  setOther: unconfigured,
  set: unconfigured,
  unset: unconfigured,
});

export const useGameState = () => React.useContext(GameStateContext);

export default function GameStateProvider({
  children,
}: React.PropsWithChildren) {
  const [mine, setMine] = React.useState(
    () => new Uint8Array(Math.ceil(9 ** totalLevel / 8))
  );
  const [other, setOther] = React.useState(
    () => new Uint8Array(Math.ceil(9 ** totalLevel / 8))
  );

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

  const set = React.useCallback(
    (track: Uint8Array) => {
      const [arrayIndex, byteIndex] = getIndexes(track);
      const Iselected = isSelected(arrayIndex, byteIndex, mine);
      const otherSelected = isSelected(arrayIndex, byteIndex, other);
      if (Iselected || otherSelected) return;
      sendSetSignal(track);
      setMine((mine) => getUpdatedState(mine, track, true));
    },
    [mine, other, sendSetSignal]
  );

  const unset = React.useCallback(
    (track: Uint8Array) => {
      const [arrayIndex, byteIndex] = getIndexes(track);
      const otherSelected = isSelected(arrayIndex, byteIndex, other);
      if (otherSelected) return;
      sendUnSetSignal(track);
      setMine((mine) => getUpdatedState(mine, track, false));
    },
    [other, sendUnSetSignal]
  );

  return (
    <GameStateContext.Provider
      value={{ mine, other, setMine, setOther, set, unset }}
    >
      {children}
    </GameStateContext.Provider>
  );
}
