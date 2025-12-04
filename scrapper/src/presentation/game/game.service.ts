import { Client, generateUUID } from "../../config";
import { FactoryLogger } from "../../config/plugins/logger";
import { GameTask, QueueRepository } from "../../domain";
import {
  AddGamesSearchToQueueUseCase,
  GetGamesWithoutResultsUseCase,
} from "../../infrastructure";

export const GameService = async (
  client: Client,
  queue: QueueRepository<GameTask>,
  loggerFactory: FactoryLogger,
  at?: Date
) => {
  const traceId = generateUUID();
  const CreateLogger = loggerFactory(traceId);
  const logger = CreateLogger("game.service.ts");

  // search for games required results
  const games = await GetGamesWithoutResultsUseCase(
    client,
    at ?? new Date(),
    CreateLogger
  );

  if (games.length) {
    logger.info(`Found ${games.length} games without results`, {
      context: { at, gamesCount: games.length },
    });
  }

  // add to queue
  AddGamesSearchToQueueUseCase({
    games,
    queue,
    CreateLogger,
  });
};
