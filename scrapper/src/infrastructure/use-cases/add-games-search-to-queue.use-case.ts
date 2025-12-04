import { generateUUID } from "../../config";
import { CreateLogger } from "../../config/plugins/logger";
import { Game, GameTask, QueueRepository } from "../../domain";

type Options = {
  games: Game[];
  queue: QueueRepository<GameTask>;
  CreateLogger: CreateLogger;
  dte?: Date;
};

export const AddGamesSearchToQueueUseCase = async ({
  games,
  queue,
  CreateLogger,
  dte,
}: Options) => {
  const logger = CreateLogger("add-games-search-to-queue.use-case.ts");

  await Promise.all(
    games.map((game) => {
      const searchDate = dte ?? new Date();

      logger.info(`Adding game to search queue: ${game.name}`, {
        context: { game, searchDate },
      });

      return queue.addTask(`searchResults:${game.name}`, {
        ...game,
        searchDate,
        traceId: generateUUID(),
      });
    })
  );
};
