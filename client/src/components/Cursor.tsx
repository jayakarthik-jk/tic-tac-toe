import { useWebrtcChannel } from "@/hooks/webrtc";
import * as React from "react";

function CursorIcon() {
  return (
    <svg
      aria-labelledby="cursorIconTitle"
      color="#2329D6"
      fill="none"
      height="28px"
      width="28px"
      role="img"
      stroke="#2329D6"
      strokeLinecap="square"
      strokeLinejoin="miter"
      strokeWidth="1"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="cursorIconTitle" />
      <polygon points="7 20 7 4 19 16 12 16 7 21" />
    </svg>
  );
}

export default function Cursor() {
  type coord = [number, number];
  const ref = React.useRef<HTMLDivElement>(null);
  const tx = useWebrtcChannel("cursor", (cursor: coord) => {
    if (ref.current) {
      ref.current.style.left = `${cursor[0] - 7}px`;
      ref.current.style.top = `${cursor[1] - 5}px`;
    }
  });

  React.useEffect(() => {
    function handler(ev: MouseEvent) {
      tx([ev.clientX, ev.clientY]);
    }
    document.addEventListener("mousemove", handler);
    return () => document.addEventListener("mousemove", handler);
  }, [tx]);
  return (
    <div className="fixed left-0 top-0" id="cursor" ref={ref}>
      <CursorIcon />
    </div>
  );
}
