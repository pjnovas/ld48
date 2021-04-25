import padStart from "lodash/padStart";
import { clamp } from "./math.utils";
import { Stats, Viewport } from "./types";

const padNum = (num: number, size: number = 4): string =>
  padStart(String(num | 0), size, "0");

const labelSize = 25;

const drawWords = (
  ctx: CanvasRenderingContext2D,
  { words, totalWords }: Stats,
  { width }: Viewport
) => {
  const size = 50;
  ctx.textAlign = "right";

  const wtxt = `${padNum(words)} / ${padNum(totalWords)}`;

  ctx.font = `${size}px Teko`;
  ctx.fillText(wtxt, width - 10, 10);

  ctx.font = `${labelSize}px Teko`;
  ctx.fillText("WORDS", width - 10, size + 10);
};

const drawScore = (
  ctx: CanvasRenderingContext2D,
  { score }: Stats,
  { width }: Viewport
) => {
  const size = 70;
  ctx.textAlign = "center";

  ctx.font = `${size}px Teko`;
  ctx.fillText(padNum(score, 5), width * 0.5, 10);

  ctx.font = `${labelSize}px Teko`;
  ctx.fillText("SCORE", width * 0.5, size);
};

const drawHM = (
  ctx: CanvasRenderingContext2D,
  { hits, misses }: Stats,
  viewport: Viewport
) => {
  const size = 50;
  ctx.textAlign = "left";
  const pad = 10;

  ctx.font = `${size}px Teko`;
  ctx.fillText(padNum(hits, 0), pad, pad);

  ctx.font = `${labelSize}px Teko`;
  ctx.fillText("HITS", pad, size);

  const y = size * 1.5;
  ctx.font = `${size}px Teko`;
  ctx.fillText(padNum(misses, 0), pad, y + pad);

  ctx.font = `${labelSize}px Teko`;
  ctx.fillText("MISSES", pad, y + size);
};

export default (
  ctx: CanvasRenderingContext2D,
  stats: Stats,
  viewport: Viewport
) => {
  ctx.save();
  ctx.textBaseline = "top";
  ctx.fillStyle = "#000000";

  drawHM(ctx, stats, viewport);
  drawScore(ctx, stats, viewport);
  drawWords(ctx, stats, viewport);
  ctx.restore();
};
