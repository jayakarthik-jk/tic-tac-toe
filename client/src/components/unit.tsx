import { useSelecthandler } from "@/hooks/select-handler";
import { cn, get_borders } from "@/lib/utils";
import * as React from "react";
import Board from "./board";

type UnitProp = {
  track: number[];
  level: number;
  primitive: boolean;
};

export default function Unit({ track, level, primitive }: UnitProp) {
  const borders = React.useMemo(
    () => get_borders(track[track.length - 1]),
    [track]
  );

  const on_select = useSelecthandler();
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
        on_select(track);
      }}
    >
      {primitive ? " " : <Board level={level - 1} track={track} />}
    </div>
  );
}
