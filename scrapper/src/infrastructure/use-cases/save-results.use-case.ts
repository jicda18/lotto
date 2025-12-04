import { Client, LuxonAdapter, CreateLogger } from "../../config";
import { Game } from "../../domain";

export const SaveResultsUseCase = async (
  client: Client,
  CreateLogger: CreateLogger,
  results: (string | number)[],
  game: Game,
  dte: Date
): Promise<boolean> => {
  const logger = CreateLogger("save-results.use-case.ts");

  if (results.length < game.resultLength) {
    logger.warn("Count of results less than game config.", {
      context: { results, game, dte },
    });
    return false;
  }

  logger.info(`Results for game: ${game.name}`, {
    context: { results, game, dte },
  });

  const gameId = game.id;

  try {
    for (const [index, result] of results.entries()) {
      const eventTime = LuxonAdapter.fromFormat(
        `${LuxonAdapter.format(dte)} ${game.resultTime}`,
        "yyyy-MM-dd HH:mm:ssZZ"
      );
      const position = index + 1;

      await client.result.upsert({
        where: {
          gameId_eventTime_position: { gameId, eventTime, position },
        },
        update: {
          result: `${result}`,
        },
        create: { gameId, eventTime, position, result: `${result}` },
      });
    }
  } catch (error) {
    logger.error(`Error saving results`, {
      context: { results, game, dte, error: (error as Error).message },
    });

    return false;
  }

  return true;
};
