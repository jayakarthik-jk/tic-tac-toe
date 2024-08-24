import Clipboard from "@/components/copy";
import Game from "@/components/game";
import { Button } from "@/components/ui/button";
import GameProvider from "@/context/gameProvider";
import { useSocket } from "@/context/socket";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createLazyFileRoute("/game/$id")({
  component: () => <GamePage />,
});

type LoadingState = "loading" | "game-full" | "waiting" | "connected";

function GamePage() {
  const { id } = Route.useParams();
  const socket = useSocket();
  const [state, setState] = useState<LoadingState>("loading");

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.emit("connect-to-game", id);
    socket.on("waiting", () => setState("waiting"));
    socket.on("connected", () => setState("connected"));
    socket.on("full", () => setState("game-full"));
  }, [id, socket]);

  return (
    <div className="w-svw h-svh flex flex-col justify-center items-center gap-4">
      <StateLoader state={state} id={id} />
    </div>
  );
}

function StateLoader({ state, id }: { state: LoadingState; id: string }) {
  if (state === "loading") {
    return <div>Loading Game...</div>;
  }
  if (state === "game-full") {
    return (
      <>
        <div>Game is full</div>
        <Link to="/">
          <Button asChild>back to home</Button>
        </Link>
      </>
    );
  }
  if (state === "waiting") {
    return (
      <>
        Waiting for your friend
        <Clipboard url={`${location.origin}/game/${id}`}>
          Copy game link
        </Clipboard>
      </>
    );
  }

  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}
