import jsfx from "./jsfx";
import library from "./library.audio.json";

const sfx = jsfx.Sounds(library);

export const play = (name: string) => {
  sfx[name] && sfx[name]();
};
