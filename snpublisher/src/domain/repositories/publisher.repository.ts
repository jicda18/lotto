import { CreateLogger } from "../../config";
import { Game, Lottery } from "../entities";

export abstract class PublisherRepository {
  constructor(public keyVersion: string) {}

  abstract publish(
    description: string,
    lottery: Lottery,
    game: Game,
    createLogger: CreateLogger,
    imageUrl?: string
  ): Promise<void>;
}
