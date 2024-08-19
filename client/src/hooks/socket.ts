import { SocketContext } from "@/context/socket";
import * as React from "react";

export const useSocket = () => React.useContext(SocketContext);
