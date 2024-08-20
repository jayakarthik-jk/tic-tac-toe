import Board from "@/components/board";
import SelectHandlerProvider, { SelectHandler } from "@/context/select-handler";
import { useWebrtcChannel } from "@/hooks/webrtc";
import * as React from "react";

export default function Game() {
  const [total_level] = React.useState(2);
  const [track, set_track] = React.useState<number[]>([]);

  const send_track = useWebrtcChannel<number[]>(
    "movement",
    React.useCallback(
      (data) => {
        if (data.length === total_level) {
          console.log("user selected", data, total_level);
          set_track([]);
        } else {
          set_track(data);
        }
      },
      [total_level]
    )
  );

  // const [game_data, set_game_data] = React.useState<number[]>([]);
  // const send_game_data = useWebrtcChannel<number[]>("game", set_game_data);

  // Esc click handler
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      set_track((track) => {
        if (e.key !== "Escape" || track.length === 0) return track;
        const newTrack = [...track];
        const exiting = newTrack.pop();
        console.log("Exiting", exiting);
        send_track(newTrack);
        return newTrack;
      });
    };
    window.addEventListener("keyup", handler);
    return () => window.removeEventListener("keyup", handler);
  }, [send_track]);

  const handle_select: SelectHandler = React.useCallback(
    (buf) => {
      set_track((track) => {
        const newTrack = [...track, buf[0]];
        send_track(newTrack);
        if (newTrack.length === total_level) return [];
        return newTrack;
      });
    },
    [send_track, total_level]
  );
  const level = total_level - track.length;
  return (
    <main className="w-svw h-svh overflow-hidden">
      <h1 className="text-center">current level {level}</h1>
      <SelectHandlerProvider handler={handle_select}>
        <Board level={level} />
      </SelectHandlerProvider>
    </main>
  );
}
