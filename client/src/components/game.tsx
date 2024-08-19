import Board from "@/components/board";
import { default_level } from "@/context/level";
import { useLevel } from "@/hooks/level";
import { SelectHandler } from "@/types";
import { useEffect } from "react";
import Cursor from "./Cursor";

export default function Game() {
  const { level, set_level } = useLevel();
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || level >= default_level) return;
      set_level(level + 1);
    };
    window.addEventListener("keyup", handler);
    return () => window.removeEventListener("keyup", handler);
  }, [level, set_level]);

  const handle_select: SelectHandler = (index, is_primitive) => {
    console.log(index);
    if (!is_primitive) {
      set_level(level - 1);
    } else {
      console.log("User selected", level, index);
      set_level(default_level);
    }
  };
  return (
    <main className="w-svw h-svh overflow-hidden">
      <h1 className="text-center">current level {level}</h1>
      <Board level={level} on_select={handle_select} />
      <Cursor />
    </main>
  );
}
