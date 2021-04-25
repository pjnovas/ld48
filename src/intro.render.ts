import { getColor } from "./render.utils";
import { GameState } from "./types";

export default (ctx: CanvasRenderingContext2D, state: GameState) => {
  const { width, height } = state.viewport;
  const { menu } = state.actions;

  ctx.save();

  const size = 80;
  const h = height * 0.4;

  ctx.fillStyle = "#333333";
  ctx.textAlign = "center";

  ctx.font = `${size}px Teko`;
  ctx.fillText("Poly Typo", width * 0.5, h - size * 2);

  ctx.font = `${size * 0.5}px Teko`;
  ctx.fillText(
    "This is a typing video game so grab a KEYBOARD",
    width * 0.5,
    h
  );
  ctx.fillText(
    "... let's see how DEEP you can go",
    width * 0.5,
    h + size * 0.6
  );

  ctx.textAlign = "left";

  const tSize = size * 0.75;
  ctx.font = `${tSize}px Teko`;
  const h2 = h + size * 3;

  const tW = ctx.measureText("Type").width;
  const aW = ctx.measureText("Type START when you are ready").width;
  const startW = Array.from(menu.word).reduce(
    (accum, letter) => accum + ctx.measureText(letter.toUpperCase()).width,
    0
  );

  const center = width * 0.5 - aW * 0.25;
  const halfStartW = startW * 0.5;

  const xA = center - tW - halfStartW;
  const xB = center - halfStartW + 10;
  const xC = center + halfStartW + 20;

  Array.from(menu.word).reduce((accum, letter, i) => {
    const w = ctx.measureText(letter.toUpperCase()).width;

    ctx.fillStyle = i >= menu.validIndex ? "#333333" : getColor([255, 0, 0, 1]);
    ctx.fillText(letter.toUpperCase(), accum, h2);

    return accum + w;
  }, xB);

  ctx.fillStyle = "#333333";
  ctx.fillText("Type", xA, h2);
  ctx.fillText("when you are ready", xC, h2);

  ctx.font = `40px Teko`;
  ctx.textAlign = "right";
  ctx.fillText("Restart > ctrl+R or cmd+R", width - 20, height - 20);

  ctx.restore();
};
