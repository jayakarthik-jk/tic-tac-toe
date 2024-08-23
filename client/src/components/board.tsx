import Unit from "./unit";

type BoardProps = {
  level: number;
  track?: number[];
};

export default function Board({ level, track = [] }: BoardProps) {
  const primitive = level === 1;
  return (
    <div className="inline-grid grid-cols-3 grid-rows-3 w-full h-full p-8">
      {[...Array(9).keys()].map((i) => (
        <Unit
          key={i}
          track={[i, ...track]}
          level={level}
          primitive={primitive}
        />
      ))}
    </div>
  );
}
