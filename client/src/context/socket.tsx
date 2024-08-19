import * as React from "react";
import { io, type Socket } from "socket.io-client";

export const SocketContext = React.createContext<Socket | undefined>(undefined);

export default function SocketProvider({ children }: React.PropsWithChildren) {
  const [socket, setSocket] = React.useState<Socket>();
  React.useEffect(() => {
    const socket = io(":3001");
    setSocket(socket);
  }, []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
