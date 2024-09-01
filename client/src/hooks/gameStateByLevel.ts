import { useGameState } from "@/context/gameState";
import { useTrack } from "@/context/track";
import { getLevelBasedGameState } from "@/lib/gameLogic";

export default function useLevelBasedGameState() {
  const { mine, other } = useGameState();
  const { track, level } = useTrack();

  return {
    mine: getLevelBasedGameState(mine, track, level),
    other: getLevelBasedGameState(other, track, level),
  };
}
