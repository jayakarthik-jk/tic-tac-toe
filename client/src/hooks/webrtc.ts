import { useSocket } from "@/hooks/socket";
import { CustomWebrtcEvent } from "@/types";
import { murmur3 } from "murmurhash-js";
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

const eventPrefix = "rtc-";
const hashBufferSize = 4;

function registerIcecandidateEvents(socket: Socket) {
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

function createDataChannel() {
  const channel = pc.createDataChannel("send data channel");
  channel.binaryType = "arraybuffer";
  return channel;
}

function initWebrtc(socket: Socket) {
  if (
    window.channel &&
    (window.channel.readyState === "open" ||
      window.channel.readyState === "connecting")
  )
    return;
  registerIcecandidateEvents(socket);
  window.channel = createDataChannel();

  pc.addEventListener("datachannel", (ev) => {
    console.log("Received data channel event in pc");

    ev.channel.addEventListener("message", (ev) => {
      if (!ev.data) return;
      const buffer = new Uint8Array(ev.data);
      const hashBytes = buffer.slice(buffer.length - hashBufferSize);
      const data = buffer.slice(0, buffer.length - hashBufferSize);
      const view = new DataView(hashBytes.buffer);
      const hash = view.getUint32(0, true);
      const label = window.labels.get(hash);
      if (!label) return;

      const event = new CustomWebrtcEvent(eventPrefix + label, data);
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
    window.channel = createDataChannel();
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    console.log("Sending answer");
    socket.emit("answer", answer);
  });
}

export function useWebrtcChannel(
  label: string,
  rx: (data: Uint8Array) => void
) {
  const socket = useSocket();

  const hash = React.useMemo(() => {
    if (!window.labels) window.labels = new Map();
    const hash = murmur3(label);
    window.labels.set(hash, label);
    return hash;
  }, [label]);

  React.useEffect(() => {
    if (!socket) return;
    initWebrtc(socket);
    function handler(e: Event) {
      const rtcEvent = e as CustomWebrtcEvent;
      if (!rtcEvent.data) return;
      rx(rtcEvent.data);
    }
    document.addEventListener(eventPrefix + label, handler);
    return () => {
      document.removeEventListener(eventPrefix + label, handler);
      window.labels.delete(hash);
    };
  }, [hash, label, rx, socket]);

  return React.useCallback(
    (data: Uint8Array) => {
      if (window.channel && window.channel.readyState === "open") {
        const view = new DataView(new ArrayBuffer(hashBufferSize));
        view.setUint32(0, hash, true);
        const hashArray = new Uint8Array(view.buffer);
        const buffer = new Uint8Array(data.length + hashBufferSize);
        buffer.set(data, 0);
        buffer.set(hashArray, data.length);
        window.channel.send(buffer);
      }
    },
    [hash]
  );
}
