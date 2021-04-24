import { Observable, of } from 'rxjs'
import { expand, filter, map, share } from 'rxjs/operators'

import { FrameData } from './types'

const clampTo30FPS = (frame: FrameData) => {
  if (frame.deltaTime > 1 / 30) {
    frame.deltaTime = 1 / 30
  }
  return frame
}

const calculateStep = (prevFrame: FrameData) =>
  new Observable<FrameData>((observer) => {
    requestAnimationFrame((frameStartTime) => {
      observer.next({
        frameStartTime,
        deltaTime: prevFrame
          ? (frameStartTime - prevFrame.frameStartTime) / 1000
          : 0
      })
    })
  }).pipe(map(clampTo30FPS))

export default of(undefined).pipe(
  expand((val) => calculateStep(val)),
  filter((frame) => frame !== undefined),
  map((frame: FrameData) => frame.deltaTime),
  share()
)
