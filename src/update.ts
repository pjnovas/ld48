import { getPolyPoints, getPolySegments } from './geometric.utils';
import { rndInt } from './math.utils';
import { GameState, Point, Polygon, Size, Tunnel, Viewport } from './types';
import words from './words';

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
    text: words[2]
  },
  ...props
});

const updatePoly = ({
  deltaTime,
  list,
  props,
  spacedBy,
  runSpeed,
  shouldFilter
}: {
  deltaTime: number;
  list: Array<Polygon>;
  props: Partial<Polygon>;
  spacedBy: number;
  runSpeed: number;
  shouldFilter: ReturnType<typeof isInsideViewport>;
}): Array<Polygon> => {
  const create =
    list.length === 0 || !list.some(poly => poly.radius < initRad * spacedBy);

  if (create) {
    list = [...list, createPoly(props)];
  }

  return list.filter(shouldFilter).map(poly => ({
    ...poly,
    word: {
      ...poly.word,
      size: poly.radius * 0.16
    }
    radius: poly.radius + poly.radius * runSpeed * deltaTime,
    points: getPolyPoints(poly),
    segments: getPolySegments(poly)
  }));
};

// const velCenter = 50
let curr = 0;

const updTunnel = (
  deltaTime: number,
  tunnel: Tunnel,
  { viewport }: GameState
): Tunnel => {
  const center: Point =
    //  tunnel.lastCenter
    // ? {
    //     x: clamp(
    //       tunnel.lastCenter.x + deltaTime * velCenter,
    //       0,
    //       viewport.width
    //     ),
    //     y: clamp(
    //       tunnel.lastCenter.y + deltaTime * velCenter,
    //       0,
    //       viewport.height
    //     )
    //   }
    // :
    {
      x: viewport.width / 2,
      y: viewport.height / 2
    };

  return {
    ...tunnel,
    lastCenter: { x: center.x, y: center.y },
    polytube: updatePoly({
      deltaTime,
      list: tunnel.polytube,
      props: {
        center,
        color: [0, 0, 0, 0.1]
      },
      spacedBy: tunnel.runSpeed * deltaTime + 1,
      runSpeed: tunnel.runSpeed,
      shouldFilter: isInsideViewport(viewport)
    }),
    polygons: updatePoly({
      deltaTime,
      list: tunnel.polygons,
      props: {
        center,
        color: [100, 100, 100, 1]
      },
      spacedBy: tunnel.runSpeed * deltaTime + 6,
      runSpeed: tunnel.runSpeed,
      shouldFilter: isInsideViewport(viewport)
    })
  };
};

const update = (
  deltaTime: number,
  state: GameState,
  inputState: string,
  worldSize: Size
): GameState => {
  if (inputState) console.log(inputState);
  state.viewport = worldSize;
  return { ...state, tunnel: updTunnel(deltaTime, state.tunnel, state) };
};

export default update;
