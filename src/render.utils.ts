import { Color, Point } from "./types";

export const getColor = (c: Color): string =>
  `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;

export const drawPath = (
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

  ctx.fillStyle = getColor(c);
  ctx.fill();
  ctx.closePath();
};
