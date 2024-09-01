import * as React from "react";
import GameStateProvider from "./gameState";
import TrackProvider from "./track";
import { totalLevel } from "@/lib/constants";

export default function GameProvider({ children }: React.PropsWithChildren) {
  return (
    <GameStateProvider totalLevel={totalLevel}>
      <TrackProvider totalLevel={totalLevel}>{children}</TrackProvider>
    </GameStateProvider>
  );
}
