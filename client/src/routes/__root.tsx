import SocketProvider from "@/context/socket";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  ),
});
