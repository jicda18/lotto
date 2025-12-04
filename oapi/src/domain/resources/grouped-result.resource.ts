import { SelfHelper } from "../../config";
import { GroupedResult } from "../entities";

export const GroupedResultResource = (result: GroupedResult) => {
  const { createdat, ...res } = result;

  return {
    ...res,
    createdAt: createdat,
    links: {
      game: SelfHelper.MakeUrl(`/games/${result.gameId}`),
    },
  };
};
