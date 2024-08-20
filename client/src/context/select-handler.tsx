import * as React from "react";

export const SelectHandlerContext = React.createContext<SelectHandler>(
  () => {}
);

export type SelectHandler = (index: number[]) => void;
export type SelectHandlerProviderProps = {
  handler: SelectHandler;
};

export default function SelectHandlerProvider({
  handler,
  children,
}: React.PropsWithChildren<SelectHandlerProviderProps>) {
  return (
    <SelectHandlerContext.Provider value={handler}>
      {children}
    </SelectHandlerContext.Provider>
  );
}
