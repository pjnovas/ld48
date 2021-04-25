import { Color } from "./types";

export const lerp = (start: number, end: number, time: number) =>
  (1 - time) * start + time * end;

export const lerpColor = (from: Color, to: Color, time: number): Color => [
  lerp(from[0], to[0], time),
  lerp(from[1], to[1], time),
  lerp(from[2], to[2], time),
  lerp(from[3], to[3], time),
];

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export const clamp01 = (num: number) => clamp(num, 0, 1);

export const rndInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);
