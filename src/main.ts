import { bufferCount, map, tap, withLatestFrom } from 'rxjs/operators'

import frames$ from './frames.stream'
import gameState$ from './gameState.stream'
import viewportState$ from './viewport.stream'
import inputState$, { clearInput } from './inputStates.stream'

import render from './render'
import update from './update'

const gameArea = document.getElementById('game') as HTMLCanvasElement

viewportState$.subscribe((size) => {
  gameArea.width = size.width
  gameArea.height = size.height
})

frames$
  .pipe(
    withLatestFrom(viewportState$, inputState$, gameState$),
    map(([deltaTime, viewportState, inputState, gameState]) =>
      update(deltaTime, gameState, inputState, viewportState)
    ),
    tap((gameState) => gameState$.next(gameState)),
    tap(clearInput)
  )
  .subscribe(render(gameArea.getContext('2d')))

// Debug FPS ---------------------------------------------
const fps = document.getElementById('fps') as HTMLDivElement

frames$
  .pipe(
    bufferCount(10),
    map(
      (frames) =>
        1 / (frames.reduce((acc, curr) => acc + curr, 0) / frames.length)
    )
  )
  .subscribe((avg) => {
    fps.innerHTML = Math.round(avg) + ''
  })
