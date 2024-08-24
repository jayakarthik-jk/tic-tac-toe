import Board from "@/components/board";
import { useTrack } from "@/context/track";
import * as React from "react";

export default function Game() {
  const [totalLevel] = React.useState(2);
  const { track } = useTrack();
  const level = totalLevel - track.length;

  return (
    <main className="w-svw h-svh overflow-hidden">
      <h1 className="text-center">current level {level}</h1>
      <Board level={level} />
    </main>
  );
}
