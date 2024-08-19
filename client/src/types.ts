export type SelectHandler = (index: number, is_primitive: boolean) => void;

declare global {
  interface Window {
    channel?: RTCDataChannel;
  }
}
