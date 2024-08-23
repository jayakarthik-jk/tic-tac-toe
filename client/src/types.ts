export class CustomWebrtcEvent extends Event {
  constructor(
    public label: string,
    public data: Uint8Array
  ) {
    super(label);
  }
}

declare global {
  interface Window {
    channel?: RTCDataChannel;
    labels: Map<number, string>;
  }
}
