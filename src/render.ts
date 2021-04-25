import {
  Color,
  GameState,
  Point,
  Polygon,
  Segment,
  Stats,
  Viewport,
  Word,
} from "./types";

import drawIntro from "./intro.render";
import drawStats from "./stats.render";

import { clamp, clamp01 } from "./math.utils";
import { drawPath, getColor } from "./render.utils";

const getMid = ([pA, pB]: [Point, Point]): Point => ({
  x: pA.x + (pB.x - pA.x) * 0.5,
  y: pA.y + (pB.y - pA.y) * 0.5,
});

const drawSegments = (
  ctx: CanvasRenderingContext2D,
  { segments, points, color, word, radius }: Polygon,
  { width, height }: Viewport,
  isCurrent?: boolean
) => {
  ctx.beginPath();

  segments.forEach(({ points }, i) => {
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
  });

  ctx.strokeStyle = getColor(color);
  ctx.lineCap = "round";
  ctx.lineWidth = 10;
  ctx.stroke();

  ctx.closePath();

  if (points) {
    drawPath(ctx, points, [
      color[0],
      color[1],
      color[2],
      clamp01((radius / height) * 0.2),
    ]);
  }

  if (!word || !isCurrent) return;

  const segment = segments[word.segment];
  if (!segment) return;

  const pm = getMid(segment.points);
  const pad = 100;
  const p = {
    x: clamp(pm.x, pad, width - pad),
    y: clamp(pm.y, pad, height - pad),
  };

  ctx.font = `${clamp(word.size, 0, 50)}px Teko`;
  ctx.textBaseline = "middle";

  type Letter = [letter: string, width: number, offset: number];

  const letters = Array.from(word.text.toUpperCase()).reduce<
    [Array<Letter>, number]
  >(
    ([letters, total], letter) => {
      const w = ctx.measureText(letter).width;
      return [[...letters, [letter, w, total]], total + w];
    },
    [[], 0]
  );

  const totalWidth = letters[1];

  letters[0].forEach((letter, i) => {
    const x = p.x + letter[2] - totalWidth * 0.5;

    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000000";

    ctx.fillStyle = i >= word.matchAt ? "#ffffff" : getColor([0, 255, 0, 1]);

    ctx.strokeText(letter[0], x, p.y);
    ctx.fillText(letter[0], x, p.y);
  });
};

const drawEnd = (ctx: CanvasRenderingContext2D, state: GameState) => {
  ctx.save();

  const { width, height } = state.viewport;

  ctx.fillStyle = getColor([255, 0, 0, 0.5]);
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";

  ctx.font = `80px Teko`;
  ctx.fillText("GAME OVER", width * 0.5, height * 0.4);

  ctx.font = `50px Teko`;
  ctx.fillText("ctrl+R or cmd+R to restart", width * 0.5, height * 0.6);

  ctx.restore();
};

export default (ctx: CanvasRenderingContext2D) => (state: GameState) => {
  ctx.clearRect(0, 0, state.viewport.width, state.viewport.height);

  if (state.screen === "menu") return drawIntro(ctx, state);

  ctx.save();

  state.tunnel.polytube.forEach((poly) =>
    drawSegments(ctx, poly, state.viewport)
  );

  const parsed = state.tunnel.polygons
    .filter(({ word }) => !word.done)
    .slice()
    .reverse();

  parsed.forEach((poly, i) => {
    drawSegments(ctx, poly, state.viewport, i === parsed.length - 1);
  });

  ctx.restore();

  if (state.screen === "end") drawEnd(ctx, state);

  drawStats(ctx, state);
};
