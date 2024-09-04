import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function unconfigured(): never {
  throw "Game State context not configured";
}

export function getBorders(index: number) {
  let left, top, right, bottom;
  left = top = right = bottom = false;
  switch (index) {
    case 0:
      right = bottom = true;
      break;
    case 1:
      left = right = bottom = true;
      break;
    case 2:
      left = bottom = true;
      break;
    case 3:
      top = right = bottom = true;
      break;
    case 4:
      left = top = right = bottom = true;
      break;
    case 5:
      left = top = bottom = true;
      break;
    case 6:
      top = right = true;
      break;
    case 7:
      left = top = right = true;
      break;
    case 8:
      left = top = true;
      break;
  }

  return { left, top, right, bottom };
}
