import Provider from "@/context/provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <Provider>
      <Outlet />
    </Provider>
  ),
});
