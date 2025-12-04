import { SelfHelper } from "../../config";
import { Result } from "../entities";

export const ResultResource = (result: Result) => ({
  ...result,
  links: {
    game: SelfHelper.MakeUrl(`/games/${result.gameId}`),
  },
});
