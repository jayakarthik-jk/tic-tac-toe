import Board from "@/components/board";
import SelectHandlerProvider, { SelectHandler } from "@/context/select-handler";
import { useWebrtcChannel } from "@/hooks/webrtc";
import * as React from "react";

function getIndexByTrack(track: Uint8Array) {
  return track.reduce((prev, curr, i) => prev + curr ** i, 0) + 1;
}

function getIndexes(track: Uint8Array) {
  // converting track to index.
  const index = getIndexByTrack(track);
  // extracting array index and byte index from index
  const arrayIndex = Math.floor(index / 8);
  const byteIndex = index % (8 * arrayIndex);
  return [arrayIndex, byteIndex] as const;
}

function getUpdatedState(
  mine: Uint8Array,
  other: Uint8Array,
  track: Uint8Array
) {
  const [arrayIndex, byteIndex] = getIndexes(track);
  const mineSelected = (mine[arrayIndex] >> byteIndex) % 2 === 1;
  const otherSelected = (other[arrayIndex] >> byteIndex) % 2 === 1;
  if (mineSelected || otherSelected) return mine;

  const newMine = new Uint8Array(mine);
  newMine[arrayIndex] = mine[arrayIndex] | (2 ** byteIndex);
  return newMine;
}

export default function Game() {
  const [totalLevel] = React.useState(1);
  const [track, setTrack] = React.useState<Uint8Array>(new Uint8Array());

  // const [am_i_x] = React.useState<boolean>(true);

  const [myState, setMyState] = React.useState(
    () => new Uint8Array(Math.ceil(9 ** totalLevel / 8))
  );

  const [otherState, setOtherState] = React.useState(
    () => new Uint8Array(Math.ceil(9 ** totalLevel / 8))
  );

  React.useEffect(() => console.log(otherState), [otherState]);

  const sendTrack = useWebrtcChannel(
    "movement",
    React.useCallback(
      (data) => {
        if (data.length === totalLevel) {
          setOtherState((otherState) =>
            getUpdatedState(otherState, myState, data)
          );
          setTrack(new Uint8Array());
        } else {
          setTrack(data);
        }
      },
      [myState, totalLevel]
    )
  );

  const handleSelect: SelectHandler = React.useCallback(
    (buf) => {
      setTrack((track) => {
        const newTrack = new Uint8Array(track.length + 1);
        newTrack.set(track, 0);
        newTrack[track.length] = buf[0];
        sendTrack(newTrack);
        if (newTrack.length === totalLevel) {
          setMyState((myState) => getUpdatedState(myState, otherState, track));
          return new Uint8Array();
        }
        return newTrack;
      });
    },
    [otherState, sendTrack, totalLevel]
  );

  const level = totalLevel - track.length;

  // Esc click handler
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setTrack((track) => {
        if (e.key !== "Escape" || track.length === 0) return track;
        const newTrack = track.slice(0, -1);
        sendTrack(newTrack);
        return newTrack;
      });
    };
    window.addEventListener("keyup", handler);
    return () => window.removeEventListener("keyup", handler);
  }, [sendTrack]);

  return (
    <main className="w-svw h-svh overflow-hidden">
      <h1 className="text-center">current level {level}</h1>
      <SelectHandlerProvider handler={handleSelect}>
        <Board level={level} />
      </SelectHandlerProvider>
    </main>
  );
}
