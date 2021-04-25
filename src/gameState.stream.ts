import { BehaviorSubject } from "rxjs";
import { GameState, Point, Segment } from "./types";

const gameState$ = new BehaviorSubject<GameState>({
  screen: "menu",

  actions: {
    menu: {
      word: "start",
      validIndex: 0,
    },
  },
  maxFails: 3,

  viewport: {
    width: 500,
    height: 500,
  },
  tunnel: {
    runSpeed: 0,
    polygons: [],
    polytube: [],

    currentTime: 0,
    currentWormIndex: 0,
  },
  stats: {
    score: 0,
    hits: 0,
    words: 0,
    misses: 0,
    totalWords: 0,
    failedWords: 0,
  },
});

export default gameState$;
