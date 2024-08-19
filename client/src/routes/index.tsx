import { Button } from "@/components/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { v4 as uuid } from "uuid";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate({ from: "/" });
  async function createGame() {
    const id = uuid();
    navigate({ to: "/game/$id", params: { id } });
  }

  return (
    <div className="h-svh flex flex-col justify-center items-center text-4xl gap-8">
      <h1>Tic Tac Toe</h1>
      <Button onClick={createGame} variant="default">
        Create new game
      </Button>
    </div>
  );
}
