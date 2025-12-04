import { BallColorGenerator } from "../domian";

const generic = {
  from: "#e0f2fe",
  via: "#0369a1",
  to: "#093455",
  font: "#ffffff",
};
const gold = {
  from: "#fef3c7",
  via: "#fcd34d",
  to: "#cb9f2e",
  font: "#ffffff",
};
const orange = {
  from: "#ffedd4",
  via: "#ffb86a",
  to: "#ff6900",
  font: "#ffffff",
};
const indigo = {
  from: "#e0e7ff",
  via: "#a3b3ff",
  to: "#615fff",
  font: "#ffffff",
};
const green = {
  from: "#dcfce7",
  via: "#7bf1a8",
  to: "#00c951",
  font: "#ffffff",
};

export const BallColorGeneratorFactory: Record<string, BallColorGenerator> = {
  LastBoloSpecial: ({ index, length }) =>
    index === length - 1 ? gold : generic,
  LastTwoBoloSpecial: ({ index, length }) => {
    if (index === length - 1) return gold;

    if (index === length - 2) return orange;

    return generic;
  },
  PlayMoreEarnMoreBolo: ({ index }) => {
    if (index < 2) return indigo;

    if (index < 4) return green;

    return gold;
  },
  default: () => generic,
};
