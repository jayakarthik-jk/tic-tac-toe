import { useLevel } from "@/hooks/level";
import { cn } from "@/lib/utils";
import { SelectHandler } from "@/types";
import { useMemo } from "react";
import Board from "./board";

type UnitProp = {
  index: number;
  level: number;
  primitive: boolean;
  on_select: SelectHandler;
};

export default function Unit(props: UnitProp) {
  const borders = useMemo(() => get_borders(props.index), [props.index]);
  const { level } = useLevel();
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
        if (level === props.level) {
          props.on_select(props.index, props.primitive);
          e.stopPropagation();
        }
      }}
    >
      {props.primitive ? (
        " "
      ) : (
        <Board level={props.level - 1} on_select={props.on_select} />
      )}
    </div>
  );
}

function get_borders(index: number) {
  let left, top, right, bottom;
  left = top = right = bottom = false;
  switch (index) {
    case 0:
      right = bottom = true;
      break;
    case 1:
      left = right = bottom = true;
      break;
    case 2:
      left = bottom = true;
      break;
    case 3:
      top = right = bottom = true;
      break;
    case 4:
      left = top = right = bottom = true;
      break;
    case 5:
      left = top = bottom = true;
      break;
    case 6:
      top = right = true;
      break;
    case 7:
      left = top = right = true;
      break;
    case 8:
      left = top = true;
      break;
  }

  return { left, top, right, bottom };
}
