import * as React from "react";

export const default_level = 2;

type LevelContextProps = {
  level: number;
  set_level: (level: number) => void;
};

export const LevelContext = React.createContext<LevelContextProps>({
  level: default_level,
  set_level: () => {},
});

export default function LevelProvider({ children }: React.PropsWithChildren) {
  const [level, set_level] = React.useState(default_level);
  return (
    <LevelContext.Provider value={{ level, set_level }}>
      {children}
    </LevelContext.Provider>
  );
}
