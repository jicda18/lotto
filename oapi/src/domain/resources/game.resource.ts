import { SelfHelper } from "../../config";
import { Game } from "../entities";

export const GameResource = (game: Game) => ({
  id: game.id,
  lotteryId: game.lotteryId,
  name: game.name,
  slug: game.slug,
  logo: game.logo,
  resultTime: game.resultTime,
  resultRenderComponent: game.resultRenderComponent,
  createdAt: game.createdAt,
  deletedAt: game.deletedAt,
  links: {
    self: SelfHelper.MakeUrl(`/games/${game.id}`),
    lottery: SelfHelper.MakeUrl(`/lotteries/${game.lotteryId}`),
    results: SelfHelper.MakeUrl(`/games/${game.id}/results`),
  },
});
