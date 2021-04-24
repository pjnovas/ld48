import { Color } from './types'

export const lerp = (start: number, end: number, time: number) =>
  start * (1 - time) + end * time

// export const lerpColor = (from: Color, to: Color, time: number): Color =>

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max)

export const clamp01 = (num: number) => clamp(num, 0, 1)
