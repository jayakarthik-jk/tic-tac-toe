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
    () => new Uint8Array(Math.ceil(9 ** totalLevel / 8)),
  );
  const [other, setOther] = React.useState(
    () => new Uint8Array(Math.ceil(9 ** totalLevel / 8)),
  );

  return (
    <GameStateContext.Provider value={{ mine, other, setMine, setOther }}>
      {children}
    </GameStateContext.Provider>
  );
}
