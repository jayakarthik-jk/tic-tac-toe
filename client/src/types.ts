export class CustomWebrtcEvent extends Event {
  constructor(
    public label: string,
    public data: unknown
  ) {
    super(label);
  }
}

declare global {
  interface Window {
    channel?: RTCDataChannel;
  }
}
