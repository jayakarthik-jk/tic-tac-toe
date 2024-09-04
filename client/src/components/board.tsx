import { bufferToTrack, getIndexes, isSelected } from "@/lib/gameLogic";
import Unit from "./unit";
import useLevelBasedGameState from "@/hooks/gameStateByLevel";
import * as React from "react";
import { useTrack } from "@/context/track";
import { queueSize, totalLevel } from "@/lib/constants";
import { useGameState } from "@/context/gameState";

type BoardProps = {
  level: number;
  track?: number[];
};

export default function Board({ level, track = [] }: BoardProps) {
  const [queue, setQueue] = React.useState<number[]>([]);
  const { mine, other } = useLevelBasedGameState();
  const { updateTrack, track: absoluteTrack } = useTrack();
  const { set, unset } = useGameState();
  const primitive = level === 1;

  const handleClick = React.useCallback(
    (buffer: number[]) => {
      const newQueue = [...queue];

      if (queue.length >= queueSize) {
        unset(bufferToTrack([...track, newQueue.shift()!], absoluteTrack));
      }

      newQueue.push(buffer[buffer.length - 1]);
      setQueue(newQueue);
      let newTrack = bufferToTrack(buffer, absoluteTrack);
      if (newTrack.length === totalLevel) {
        set(newTrack);
        newTrack = new Uint8Array();
      }

      updateTrack(newTrack);
    },
    [absoluteTrack, queue, set, track, unset, updateTrack]
  );

  function labelOf(index: number) {
    if (!primitive) return;
    const trackOfUnit = new Uint8Array(track.length + 1);
    trackOfUnit.set(track);
    trackOfUnit[track.length] = index;

    const [arrayIndex, byteIndex] = getIndexes(trackOfUnit);
    if (isSelected(arrayIndex, byteIndex, mine)) {
      return "X";
    }
    if (isSelected(arrayIndex, byteIndex, other)) {
      return "O";
    }
  }

  return (
    <div className="inline-grid grid-cols-3 grid-rows-3 w-full h-full p-8">
      {[...Array(9).keys()].map((i) => (
        <Unit
          key={i}
          track={[...track, i]}
          level={level}
          primitive={primitive}
          label={labelOf(i)}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}
