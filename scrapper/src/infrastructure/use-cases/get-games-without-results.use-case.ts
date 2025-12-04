import { Client, LuxonAdapter, CreateLogger } from "../../config";

export const GetGamesWithoutResultsUseCase = async (
  client: Client,
  at: Date,
  CreateLogger: CreateLogger
) => {
  const logger = CreateLogger("get-games-without-results.use-case.ts");

  try {
    const games = await client.game.findMany({
      where: {
        deletedAt: null,
        results: {
          none: {
            eventTime: {
              gte: LuxonAdapter.startOf(at, "day"),
              lte: LuxonAdapter.endOf(at, "day"),
            },
            deletedAt: null,
          },
        },
      },
    });

    return games.filter((game) => {
      const resultTime = LuxonAdapter.fromFormat(
        `${LuxonAdapter.format(at)} ${game.resultTime}`,
        "yyyy-MM-dd HH:mm:ssZZ"
      );

      return LuxonAdapter.compare(resultTime, at, "<=");
    });
  } catch (error) {
    logger.error(`Error fetching games without results`, {
      context: { at, error },
    });
    return [];
  }
};
