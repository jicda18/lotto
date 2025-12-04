import { CreateLogger } from "../../config";
import { Game, Lottery } from "../entities";

export interface ResourcesRepository {
  getLottery(
    lotteryId: string,
    createLogger: CreateLogger
  ): Promise<Lottery | null>;

  getGame(gameId: string, createLogger: CreateLogger): Promise<Game | null>;
}
