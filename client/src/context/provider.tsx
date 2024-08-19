import * as React from "react";
import { Toaster } from "react-hot-toast";
import LevelProvider from "./level";
import SocketProvider from "./socket";

export default function Provider({ children }: React.PropsWithChildren) {
  return (
    <SocketProvider>
      <LevelProvider>
        {children}
        <Toaster />
      </LevelProvider>
    </SocketProvider>
  );
}
