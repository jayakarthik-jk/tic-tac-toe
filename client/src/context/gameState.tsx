import * as React from "react";

type GameState = {
  mine: Uint8Array;
  other: Uint8Array;
  setMine: React.Dispatch<React.SetStateAction<Uint8Array>>;
  setOther: React.Dispatch<React.SetStateAction<Uint8Array>>;
};

export const GameStateContext = React.createContext<GameState>({
  mine: new Uint8Array(),
  other: new Uint8Array(),
  setMine: () => {
    throw "Game State context not configured";
  },
  setOther: () => {
    throw "Game State context not configured";
  },
});

export const useGameState = () => React.useContext(GameStateContext);

type GameStateProviderProps = { totalLevel: number };

export default function GameStateProvider({
  children,
  totalLevel,
}: React.PropsWithChildren<GameStateProviderProps>) {
  const [mine, setMine] = React.useState(
    () => new Uint8Array(Math.ceil(9 ** totalLevel / 8))
  );
  const [other, setOther] = React.useState(
    () => new Uint8Array(Math.ceil(9 ** totalLevel / 8))
  );

  console.log({ mine, other });

  return (
    <GameStateContext.Provider value={{ mine, other, setMine, setOther }}>
      {children}
    </GameStateContext.Provider>
  );
}

// Game Logics

function getIndexByTrack(track: Uint8Array) {
  return track.reduceRight((prev, curr, i) => prev + 9 ** i * curr, 0);
}

export function getIndexes(track: Uint8Array) {
  // converting track to index.
  const index = getIndexByTrack(track);
  // extracting array index and byte index from index
  const arrayIndex = Math.floor(index / 8);
  const byteIndex = arrayIndex === 0 ? index : index % (8 * arrayIndex);
  return [arrayIndex, byteIndex] as const;
}

export function isSelected(
  arrayIndex: number,
  byteIndex: number,
  state: Uint8Array
) {
  return (state[arrayIndex] >> byteIndex) % 2 === 1;
}

export function getUpdatedState(
  mine: Uint8Array,
  other: Uint8Array,
  track: Uint8Array
) {
  const [arrayIndex, byteIndex] = getIndexes(track);
  const mineSelected = isSelected(arrayIndex, byteIndex, mine);
  const otherSelected = isSelected(arrayIndex, byteIndex, other);

  if (mineSelected || otherSelected) return mine;

  const newMine = new Uint8Array(mine);
  newMine[arrayIndex] = mine[arrayIndex] | (2 ** byteIndex);
  return newMine;
}
