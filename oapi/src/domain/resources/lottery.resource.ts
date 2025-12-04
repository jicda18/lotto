import { SelfHelper } from "../../config";
import { Lottery } from "../entities";

export const LotteryResource = (lottery: Lottery) => ({
  ...lottery,
  links: {
    self: SelfHelper.MakeUrl(`/lotteries/${lottery.id}`),
    games: SelfHelper.MakeUrl(`/lotteries/${lottery.id}/games`),
  },
});
