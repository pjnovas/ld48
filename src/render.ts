import { Color, GameState, Point, Polygon, Segment, Word } from "./types";
import { clamp01 } from "./math.utils";

const getColor = (c: Color): string =>
  `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;

const drawCircle = (
  ctx: CanvasRenderingContext2D,
  { x, y }: Point,
  radius: number
) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#ff0000";
  ctx.fill();
  ctx.closePath();
};

const drawPath = (
  ctx: CanvasRenderingContext2D,
  points: Array<Point>,
  c: Color = [0, 0, 0, 1]
) => {
  ctx.beginPath();

  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x, p.y);
    if (i === points.length - 1) ctx.lineTo(points[0].x, points[0].y);
  });

  // ctx.strokeStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
  // ctx.lineJoin = "round";
  // ctx.lineWidth = 3;
  // ctx.stroke();

  ctx.fillStyle = getColor(c);
  ctx.fill();
  ctx.closePath();

  // drawCircle(ctx, points[0], 3)
  // points.forEach((p, i) => {
  //   drawCircle(ctx, p, 3)
  // })
};

const getMid = ([pA, pB]: [Point, Point]): Point => ({
  x: pA.x + (pB.x - pA.x) * 0.5,
  y: pA.y + (pB.y - pA.y) * 0.5,
});

const drawSegments = (
  ctx: CanvasRenderingContext2D,
  { segments, points, color, word, radius }: Polygon,
  height?: number
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
      clamp01((radius / height) * 0.5),
    ]);
  }

  if (!word) return;

  const segment = segments[word.segment];
  if (!segment) return;

  const p = getMid(segment.points);

  ctx.font = `${word.size}px Teko`;
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

  const width = letters[1];
  const h = word.size;

  // ctx.fillStyle = getColor([255, 0, 0, 0.8]);
  // ctx.fillRect(p.x - width * 0.65, p.y - h * 0.55, width * 1.15, h);

  letters[0].forEach((letter, i) => {
    // const lw = letter[1];
    const x = p.x + letter[2] - width * 0.5;

    // ctx.fillStyle = i >= word.matchAt ? "#ff0000" : "#00ff00";
    // ctx.fillRect(x - lw / 2, p.y - h * 0.55, lw, h);

    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000000";

    ctx.fillStyle = i >= word.matchAt ? "#ffffff" : getColor([0, 255, 0, 1]);

    ctx.strokeText(letter[0], x, p.y);
    ctx.fillText(letter[0], x, p.y);
  });
};

export default (ctx: CanvasRenderingContext2D) => (state: GameState) => {
  const { width, height } = state.viewport;
  ctx.clearRect(0, 0, width, height);

  ctx.save();

  state.tunnel.polytube.forEach((poly) => drawSegments(ctx, poly));

  state.tunnel.polygons
    .filter(({ word }) => !word.done)
    .slice()
    .reverse()
    .forEach((poly) => {
      drawSegments(ctx, poly, height);
    });

  ctx.restore();
};
