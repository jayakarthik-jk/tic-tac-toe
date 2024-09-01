import Board from "@/components/board";
import { useGameState } from "@/context/gameState";
import { useTrack } from "@/context/track";
import { useWebrtcChannel } from "@/hooks/webrtc";
import * as React from "react";

export default function Game() {
  const { level } = useTrack();
  const { mine, other, setMine, setOther } = useGameState();

  const sendMyGameState = useWebrtcChannel("my-game-state", setOther);
  const sendOtherGameState = useWebrtcChannel("other-game-state", setMine);

  const requestGameState = useWebrtcChannel(
    "request-game-state",
    React.useCallback(() => {
      sendMyGameState(mine);
      sendOtherGameState(other);
    }, [mine, other, sendMyGameState, sendOtherGameState])
  );

  React.useLayoutEffect(() => {
    requestGameState(new Uint8Array());
  }, [requestGameState]);

  return (
    <main className="w-svw h-svh overflow-hidden">
      <h1 className="text-center">current level {level}</h1>
      <Board level={level} />
    </main>
  );
}
