import { BehaviorSubject } from "rxjs";
import { GameState, Point, Segment } from "./types";

const gameState$ = new BehaviorSubject<GameState>({
  viewport: {
    width: 500,
    height: 500,
  },
  tunnel: {
    runSpeed: 0.8,
    polygons: [],
    polytube: [],

    currentTime: 0,
    currentWormIndex: 0,
  },
});

export default gameState$;
