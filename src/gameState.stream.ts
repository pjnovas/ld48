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
    // TODO: every X seconds move the tail
  },
});

export default gameState$;
