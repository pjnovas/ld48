import times from 'lodash/times'
import { Point, Polygon, Segment } from './types'

export const getPolyPoints = ({
  sides,
  radius,
  center,
  rotation = 0
}: Polygon): Array<Point> => {
  const angle = (2 * Math.PI) / sides + rotation

  return times<Point>(sides, (i) => ({
    x: center.x + radius * Math.cos(i * angle),
    y: center.y + radius * Math.sin(i * angle)
  }))
}

const words = [
  'currency',
  'artisan',
  'orange',
  'cheek',
  'presentation',
  'crush',
  'tighten',
  'ensure',
  'float',
  'fall',
  'convert',
  'shift',
  'see',
  'dump',
  'remain',
  'add',
  'thrust',
  'rescue',
  'relax',
  'suit'
]

export const getPolySegments = ({
  sides,
  radius,
  center,
  rotation = 0
}: Polygon): Array<Segment> => {
  const angle = (2 * Math.PI) / sides + rotation

  const pointAt = (i: number) => ({
    x: center.x + radius * Math.cos(i * angle),
    y: center.y + radius * Math.sin(i * angle)
  })

  return times<Segment>(sides, (i) => ({
    points: [pointAt(i), pointAt(i < sides ? i + 1 : 0)]
    // color: [10, 10, 10, 10],
    // word: words[i]
  }))
}
