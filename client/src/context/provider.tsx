import * as React from "react";
import { Toaster } from "react-hot-toast";
import SocketProvider from "./socket";

export default function Provider({ children }: React.PropsWithChildren) {
  return (
    <SocketProvider>
      {children}
      <Toaster />
    </SocketProvider>
  );
}
