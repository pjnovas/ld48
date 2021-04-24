import { BehaviorSubject } from 'rxjs';
import { GameState, Point, Segment } from './types';

const gameState$ = new BehaviorSubject<GameState>({
  viewport: {
    width: 500,
    height: 500
  },
  tunnel: {
    runSpeed: 0.8,
    lastCreation: 0,
    // lastCenter: { x: 0, y: 0 },
    polygons: [],
    polytube: []
  }
});

export default gameState$;
