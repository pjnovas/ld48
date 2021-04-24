import { BehaviorSubject } from 'rxjs'
import { GameState } from './types'

interface TunnelState {}

const tunnelState$ = new BehaviorSubject<TunnelState>({})

export const update = (
  deltaTime: number,
  state: TunnelState,
  gameState: GameState
): /* TunnelState */ void => {}

export const draw = (ctx: CanvasRenderingContext2D) => (
  state: TunnelState
) => {}

export default tunnelState$
