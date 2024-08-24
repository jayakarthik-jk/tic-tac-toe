import { getIndexes, isSelected, useGameState } from "@/context/gameState";
import { useTrack } from "@/context/track";
import { cn, getBorders } from "@/lib/utils";
import * as React from "react";
import Board from "./board";

type UnitProp = {
  track: number[];
  level: number;
  primitive: boolean;
};

export default function Unit({ track, level, primitive }: UnitProp) {
  const borders = React.useMemo(
    () => getBorders(track[track.length - 1]),
    [track]
  );
  const { mine, other } = useGameState();

  const label = React.useMemo(() => {
    const [arrayIndex, byteIndex] = getIndexes(new Uint8Array(track));
    if (isSelected(arrayIndex, byteIndex, mine)) {
      return "X";
    }
    if (isSelected(arrayIndex, byteIndex, other)) {
      return "O";
    }
    return " ";
  }, [mine, other, track]);

  const { handleSelect } = useTrack();

  return (
    <div
      className={cn(
        {
          "border-l": borders.left,
          "border-t": borders.top,
          "border-r": borders.right,
          "border-b": borders.bottom,
        },
        "border-primary flex justify-center items-center"
      )}
      onClick={(e) => {
        e.stopPropagation();
        handleSelect(track);
      }}
    >
      {primitive ? label : <Board level={level - 1} track={track} />}
    </div>
  );
}
