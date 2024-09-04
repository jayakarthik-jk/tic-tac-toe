import * as React from "react";
import GameStateProvider from "./gameState";
import TrackProvider from "./track";

export default function GameProvider({ children }: React.PropsWithChildren) {
  return (
    <GameStateProvider>
      <TrackProvider>{children}</TrackProvider>
    </GameStateProvider>
  );
}
