import first from "lodash/first";
import { getPolyPoints, getPolySegments } from "./geometric.utils";
import { rndInt, clamp, lerp, clamp01 } from "./math.utils";
import {
  GameState,
  Point,
  Polygon,
  Size,
  Stats,
  Tunnel,
  Viewport,
} from "./types";
import { play } from "./audio";
import words from "./words.json";

const isInsideViewport = (viewport: Viewport, m: number = 1.6) => (
  poly: Polygon
): boolean =>
  !(poly.radius * m > viewport.width && poly.radius * m > viewport.height);

const initRad = 1;

const createPoly = (props: Partial<Polygon>): Polygon => ({
  center: { x: 0, y: 0 },
  radius: initRad,
  sides: 8,
  color: [0, 0, 0, 0.3],
  rotation: 0,
  word: {
    segment: rndInt(0, 8 - 1 /* sides */),
    text: words[rndInt(0, words.length - 1)],
    matchAt: 0,
  },
  ...props,
});

const updatePoly = ({
  deltaTime,
  list,
  props,
  spacedBy,
  runSpeed,
  gate,
  shouldFilter,
  stats,
}: {
  deltaTime: number;
  list: Array<Polygon>;
  props: Partial<Polygon>;
  spacedBy: number;
  runSpeed: number;
  gate: boolean;
  shouldFilter: ReturnType<typeof isInsideViewport>;
  stats: Stats;
}): Array<Polygon> => {
  const create =
    list.length === 0 || !list.some((poly) => poly.radius < initRad * spacedBy);

  if (create) {
    list = [...list, createPoly(props)];
    if (gate) stats.totalWords++;
  }

  return list.filter(shouldFilter).map((poly) => ({
    ...poly,
    word: gate && {
      ...poly.word,
      size: poly.radius * 0.16,
    },
    radius: poly.radius + poly.radius * runSpeed * deltaTime,
    points: gate && getPolyPoints(poly),
    segments: getPolySegments(poly),
  }));
};

const wormPoints = (viewport: Viewport) => [
  {
    x: viewport.width * 0.5,
    y: viewport.height * 0.75,
  },
  {
    x: viewport.width * 0.25,
    y: viewport.height * 0.5,
  },
  {
    x: viewport.width * 0.75,
    y: viewport.height * 0.25,
  },
  {
    x: viewport.width * 0.3,
    y: viewport.height * 0.5,
  },
];

const getCenter = (
  deltaTime: number,
  tunnel: Tunnel,
  viewport: Viewport
): Point => {
  if (!tunnel.currentCenter) {
    tunnel.currentTarget = {
      time: 1000,
      target: wormPoints(viewport)[0],
    };

    return {
      x: viewport.width * 0.5,
      y: viewport.height * 0.5,
    };
  }

  const t = clamp01(tunnel.currentTime / tunnel.currentTarget.time);

  const center: Point = {
    x: lerp(tunnel.currentCenter.x, tunnel.currentTarget.target.x, t),
    y: lerp(tunnel.currentCenter.y, tunnel.currentTarget.target.y, t),
  };

  tunnel.currentTime += deltaTime;

  if (t * 100 > 1) {
    tunnel.currentTime = 0;
    tunnel.currentWormIndex++;
    const worm = wormPoints(viewport);
    if (tunnel.currentWormIndex > worm.length - 1) tunnel.currentWormIndex = 0;
    tunnel.currentTarget.target = worm[tunnel.currentWormIndex];
  }

  return { x: center.x, y: center.y };
};

const updTunnel = (
  deltaTime: number,
  tunnel: Tunnel,
  { viewport, stats }: GameState
): Tunnel => {
  const currentCenter = getCenter(deltaTime, tunnel, viewport);

  const spaced = tunnel.runSpeed * deltaTime;
  const gateSpace = clamp(10 - Math.floor(stats.totalWords / 10), 6, 10);
  tunnel.runSpeed = stats.totalWords / 100 + 0.8;

  return {
    ...tunnel,
    currentCenter,
    polytube: updatePoly({
      deltaTime,
      list: tunnel.polytube,
      props: {
        center: currentCenter,
        color: [0, 0, 0, 0.1],
      },
      gate: false,
      spacedBy: spaced + 1.05,
      runSpeed: tunnel.runSpeed,
      shouldFilter: isInsideViewport(viewport, 1.2),
      stats,
    }),
    polygons: updatePoly({
      deltaTime,
      list: tunnel.polygons,
      props: {
        center: currentCenter,
        color: [255, 0, 0, 1],
      },
      gate: true,
      spacedBy: spaced + gateSpace,
      runSpeed: tunnel.runSpeed,
      shouldFilter: (poly: Polygon): boolean => {
        const keep = isInsideViewport(viewport, 1.2)(poly);
        if (!keep && !poly.word.done) {
          stats.failedWords++;
          play("fail");
        }
        return keep;
      },
      stats,
    }),
  };
};

const update = (
  deltaTime: number,
  state: GameState,
  inputState: string,
  worldSize: Size
): GameState => {
  state.viewport = worldSize;

  if (state.screen === "end") return state;

  if (state.screen === "menu") {
    const nextChar = state.actions.menu.word.charAt(
      state.actions.menu.validIndex
    );

    if (inputState.length === 1) {
      if (inputState === nextChar) {
        play("type");

        state.actions.menu.validIndex++;
        if (state.actions.menu.validIndex >= state.actions.menu.word.length) {
          state.actions.menu.validIndex = 0;
          state.screen = "gameplay";
          play("word");
        }
      } else {
        play("miss");
      }
    }

    return state;
  }

  if (state.screen === "gameplay" && inputState.length === 1) {
    const poly = state.tunnel.polygons.find(({ word }) => !word.done);
    if (!poly) return;
    const word = poly.word;

    if (inputState === word.text.charAt(word.matchAt)) {
      play("type");

      if (word.matchAt === word.text.length - 1) {
        word.done = true;
        state.stats.score += word.text.length;
        state.stats.words++;
        play("word");
      } else {
        word.matchAt++;
        state.stats.hits++;
      }
    } else {
      play("miss");
      state.stats.misses++;
    }
  }

  if (state.stats.failedWords >= state.maxFails) {
    state.screen = "end";
    play("loose");
    return state;
  }

  return { ...state, tunnel: updTunnel(deltaTime, state.tunnel, state) };
};

export default update;
