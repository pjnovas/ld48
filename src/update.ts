import { clamp } from 'lodash'
import { getPolyPoints, getPolySegments } from './geometric.utils'
import { GameState, Point, Polygon, Size, Tunnel, Viewport } from './types'

const isInsideViewport = (viewport: Viewport, m: number = 1.6) => (
  poly: Polygon
): boolean =>
  !(poly.radius * m > viewport.width && poly.radius * m > viewport.height)

const initRad = 1

const createPoly = (props: Partial<Polygon>): Polygon => ({
  center: { x: 0, y: 0 },
  radius: initRad,
  sides: 8,
  color: [0, 0, 0, 0.3],
  rotation: 0,
  ...props
})

const sizeVel = 0.0005

const updatePoly = (
  deltaTime: number,
  list: Array<Polygon>,
  props: Partial<Polygon>,
  spacedBy: number,
  shouldFilter: ReturnType<typeof isInsideViewport>
): Array<Polygon> => {
  const create =
    list.length === 0 ||
    !list.some(
      (poly) => poly.radius >= initRad && poly.radius < initRad * spacedBy
    )

  if (create) {
    list = [...list, createPoly(props)]
  }

  return list.filter(shouldFilter).map((poly) => ({
    ...poly,
    radius: poly.radius + (poly.radius * sizeVel) / deltaTime,
    points: getPolyPoints(poly),
    segments: getPolySegments(poly)
  }))
}

// const velCenter = 50

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
    }

  return {
    ...tunnel,
    lastCenter: { x: center.x, y: center.y },
    polytube: updatePoly(
      deltaTime,
      tunnel.polytube,
      {
        center,
        color: [0, 0, 0, 0.1]
      },
      1,
      isInsideViewport(viewport)
    ),
    polygons: updatePoly(
      deltaTime,
      tunnel.polygons,
      {
        center,
        color: [0, 0, 0, 0.3]
      },
      3,
      isInsideViewport(viewport)
    )
  }
}

const update = (
  deltaTime: number,
  state: GameState,
  inputState: string,
  worldSize: Size
): GameState => {
  if (inputState) console.log(inputState)

  state.viewport = worldSize

  // state.poly.radius = worldSize.height / 2 - 20
  // state.poly.sides +=
  //   inputState === 'arrowup' ? 1 : inputState === 'arrowdown' ? -1 : 0

  // state.segments = getPolySegments(state.poly)

  return { ...state, tunnel: updTunnel(deltaTime, state.tunnel, state) }
}

export default update
