import { SelectHandler } from "@/types";
import Unit from "./unit";

type BoardProps = {
  level: number;
  on_select: SelectHandler;
};

export default function Board({ level, on_select }: BoardProps) {
  const primitive = level === 1;
  return (
    <div className="inline-grid grid-cols-3 grid-rows-3 w-full h-full p-8">
      <Unit
        index={0}
        level={level}
        primitive={primitive}
        on_select={on_select}
      />
      <Unit
        index={1}
        level={level}
        primitive={primitive}
        on_select={on_select}
      />
      <Unit
        index={2}
        level={level}
        primitive={primitive}
        on_select={on_select}
      />
      <Unit
        index={3}
        level={level}
        primitive={primitive}
        on_select={on_select}
      />
      <Unit
        index={4}
        level={level}
        primitive={primitive}
        on_select={on_select}
      />
      <Unit
        index={5}
        level={level}
        primitive={primitive}
        on_select={on_select}
      />
      <Unit
        index={6}
        level={level}
        primitive={primitive}
        on_select={on_select}
      />
      <Unit
        index={7}
        level={level}
        primitive={primitive}
        on_select={on_select}
      />
      <Unit
        index={8}
        level={level}
        primitive={primitive}
        on_select={on_select}
      />
    </div>
  );
}
