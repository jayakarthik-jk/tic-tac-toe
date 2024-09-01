import { cn, getBorders } from "@/lib/utils";
import * as React from "react";
import Board from "./board";

type UnitProp = {
  track: number[];
  level: number;
  primitive: boolean;
  label?: string;
  onClick: (track: number[]) => void;
};

export default function Unit({
  label,
  track,
  level,
  primitive,
  onClick,
}: UnitProp) {
  const borders = React.useMemo(
    () => getBorders(track[track.length - 1]),
    [track],
  );

  return (
    <div
      className={cn(
        {
          "border-l": borders.left,
          "border-t": borders.top,
          "border-r": borders.right,
          "border-b": borders.bottom,
        },
        "border-primary flex justify-center items-center",
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick(track);
      }}
    >
      {primitive ? label : <Board level={level - 1} track={track} />}
    </div>
  );
}
