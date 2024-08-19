import { useSocket } from "@/hooks/socket";
import * as React from "react";
import { Socket } from "socket.io-client";

const pc = new RTCPeerConnection({
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
});
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const event_prefix = "webrtc-custom-event-";
// type CustomWebrtcEvent = Event & { data?: string };

class CustomWebrtcEvent extends Event {
  constructor(
    public label: string,
    public data: unknown
  ) {
    super(label);
  }
}

function register_icecandidate_events(socket: Socket) {
  // send our ice candidate
  pc.addEventListener("icecandidate", (event) => {
    if (!event.candidate) return;
    socket.emit("icecandidate", event.candidate.toJSON());
  });

  // receive their ice candidate
  socket.on("icecandidate", (candidate) => {
    if (!candidate || !pc.remoteDescription) return;
    pc.addIceCandidate(new RTCIceCandidate(candidate));
  });
}

function create_data_channel() {
  const channel = pc.createDataChannel("send data channel");
  channel.binaryType = "arraybuffer";
  return channel;
}

function init_webrtc(socket: Socket) {
  if (window.channel && window.channel.readyState === "open") return;
  register_icecandidate_events(socket);
  window.channel = create_data_channel();

  pc.addEventListener("datachannel", (ev) => {
    console.log("Received data channel event in pc");

    ev.channel.addEventListener("message", (ev) => {
      if (!ev.data) return;
      const decoded = decoder.decode(ev.data);
      const resp = JSON.parse(decoded) as { label: string; data: unknown };
      const event = new CustomWebrtcEvent(resp.label, resp.data);
      document.dispatchEvent(event);
    });
  });

  pc.createOffer().then((offer) => {
    console.log("Sending offer");
    socket.emit("offer", offer);
    socket.on("answer", async (answer) => {
      await pc.setLocalDescription(offer);
      console.log("received answer");
      await pc.setRemoteDescription(answer);
    });
  });

  socket.on("offer", async (offer) => {
    console.log("received Offer");
    if (window.channel) {
      window.channel.close();
    }
    window.channel = create_data_channel();
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    console.log("Sending answer");
    socket.emit("answer", answer);
  });
}

export function useWebrtcChannel<T>(label: string, rx: (data: T) => void) {
  const socket = useSocket();

  React.useEffect(() => {
    if (!socket) return;
    init_webrtc(socket);
    function handler(e: Event) {
      const rtcEvent = e as CustomWebrtcEvent;
      if (!rtcEvent.data) return;
      rx(rtcEvent.data as T);
    }
    document.addEventListener(event_prefix + label, handler);
    return () => document.removeEventListener(event_prefix + label, handler);
  }, [label, rx, socket]);

  return (data: T) => {
    if (window.channel && window.channel.readyState === "open") {
      const str = JSON.stringify({ label: event_prefix + label, data });
      const encoded = encoder.encode(str);
      window.channel.send(encoded);
    }
  };
}
