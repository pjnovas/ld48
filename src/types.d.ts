export interface FrameData {
  frameStartTime: number
  deltaTime: number
}

interface Point {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

interface Viewport {
  width: number
  height: number
}

type Color = [number, number, number, number]

interface Polygon {
  center: Point
  radius: number
  sides: number
  rotation?: number
  points?: Array<Point>
  segments?: Array<Segment>
  color: Color
}

interface Segment {
  points: [Point, Point]
  color?: Color
  word?: string
}

interface Tunnel {
  lastCenter?: Point
  polygons: Array<Polygon>
  polytube: Array<Polygon>
}

export interface GameState {
  viewport: Viewport
  tunnel: Tunnel
  lastTime?: number
  // poly: Polygon
  // segments: Array<Segment>
  // points: Array<Point>
  // objects: Array<Record<string, unknown>>
}
