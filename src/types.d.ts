export interface FrameData {
  frameStartTime: number;
  deltaTime: number;
}

interface Point {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface Viewport {
  width: number;
  height: number;
}

type Color = [number, number, number, number];

interface Word {
  text: string;
  segment: number;
  size?: number;
  points?: number;
  matchAt?: number;
  done?: boolean;
  score?: number;
}

interface Polygon {
  center: Point;
  radius: number;
  sides: number;
  rotation?: number;
  points?: Array<Point>;
  segments?: Array<Segment>;
  color: Color;
  word: Word;
}

interface Segment {
  points: [Point, Point];
  color?: Color;
}

interface Tunnel {
  runSpeed: number;
  polygons: Array<Polygon>;
  polytube: Array<Polygon>;

  // timed
  lastCenter?: Point;
}

export interface GameState {
  viewport: Viewport;
  tunnel: Tunnel;
  lastTime?: number;
}
