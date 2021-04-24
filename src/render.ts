import { Color, GameState, Point, Segment } from './types'

const drawCircle = (
  ctx: CanvasRenderingContext2D,
  { x, y }: Point,
  radius: number
) => {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.fillStyle = '#ff0000'
  ctx.fill()
  ctx.closePath()
}

const drawPath = (
  ctx: CanvasRenderingContext2D,
  points: Array<Point>,
  c: Color = [0, 0, 0, 1]
) => {
  ctx.beginPath()

  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y)
    ctx.lineTo(p.x, p.y)
    if (i === points.length - 1) ctx.lineTo(points[0].x, points[0].y)
  })

  ctx.strokeStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`
  ctx.lineJoin = 'round'
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.closePath()

  // drawCircle(ctx, points[0], 3)
  // points.forEach((p, i) => {
  //   drawCircle(ctx, p, 3)
  // })
}

const drawSegments = (
  ctx: CanvasRenderingContext2D,
  segments: Array<Segment>,
  c: Color
) => {
  ctx.beginPath()

  segments.forEach(({ points }, i) => {
    ctx.moveTo(points[0].x, points[0].y)
    ctx.lineTo(points[1].x, points[1].y)
  })

  ctx.strokeStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`
  ctx.lineCap = 'round'
  ctx.lineWidth = 10
  ctx.stroke()
  ctx.closePath()

  const getMid = ([pA, pB]: [Point, Point]): Point => ({
    x: pA.x + (pB.x - pA.x) * 0.5,
    y: pA.y + (pB.y - pA.y) * 0.5
  })

  segments
    .filter(({ word }) => word)
    .forEach(({ word, points }, i) => {
      const p = getMid(points)
      const textSize = 30

      ctx.font = `${textSize}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const text = word.toUpperCase()
      const m = ctx.measureText(text)

      const h = textSize * 1.1
      const w = m.width * 1.1

      ctx.fillStyle = '#000000'
      ctx.fillRect(p.x - w * 0.5, p.y - h * 0.55, w, h)

      ctx.fillStyle = '#ffffff'
      ctx.fillText(text, p.x, p.y)
    })
}

export default (ctx: CanvasRenderingContext2D) => (state: GameState) => {
  const { width, height } = state.viewport
  ctx.clearRect(0, 0, width, height)

  // ctx.save()
  // ctx.translate(width / 2, height / 2)
  // drawSegments(ctx, state.segments)
  // ctx.restore()

  ctx.save()
  state.tunnel.polytube.forEach(({ points, color }) =>
    drawPath(ctx, points, color)
  )

  state.tunnel.polygons.forEach(({ segments, color }) =>
    // drawPath(ctx, points, color)
    drawSegments(ctx, segments, color)
  )
  ctx.restore()
}
