import * as React from "react";
import GameStateProvider from "./gameState";
import TrackProvider from "./track";

export default function GameProvider({ children }: React.PropsWithChildren) {
  const [totalLevel] = React.useState(2);
  return (
    <GameStateProvider totalLevel={totalLevel}>
      <TrackProvider totalLevel={totalLevel}>{children}</TrackProvider>
    </GameStateProvider>
  );
}
