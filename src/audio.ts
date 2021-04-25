import jsfx from "./jsfx";
import library from "./library.audio.json";

export const initialize = () => {
  // jsfx.Sounds(library);
};

export const play = () => {
  const sfx = jsfx.Sounds(library);
  sfx.select();
};
