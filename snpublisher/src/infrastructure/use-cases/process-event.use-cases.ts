import { CreateLogger, toHashtag } from "../../config";
import { LuxonAdapter } from "../../config/luxon.adapter";
import {
  EventEntity,
  PublisherRepository,
  ResourcesRepository,
} from "../../domain";

export const ProcessEventUseCases = async (
  event: EventEntity,
  resources: ResourcesRepository,
  publishers: PublisherRepository[],
  createLogger: CreateLogger
) => {
  const logger = createLogger("process-event.use-cases.ts");

  const { lotteryId, gameId, dte, ...urls } = event;

  const [lottery, game] = await Promise.all([
    resources.getLottery(lotteryId, createLogger),
    resources.getGame(gameId, createLogger),
  ]);

  if (!lottery || !game) {
    logger.warn("Lottery or Game not found", { context: { lottery, game } });

    return;
  }

  logger.info("Lottery and Game found", { context: { lottery, game } });

  const formattedDate = LuxonAdapter.toDate(dte).toLocaleString("es", {
    dateStyle: "full",
  });

  const url = `https://lotto.local/lotteries/${lottery.slug}/games/${
    game.slug
  }?date=${LuxonAdapter.format(dte)}`;
  const description = `Resultados de hoy, ${formattedDate}, del sorteo ${
    game.name
  } de la lotería ${
    lottery.name
  }. Más información visita ${url}\n\n#lotto ${toHashtag(
    lottery.name
  )} ${toHashtag(
    game.name
  )}\n\n\nEsta post es únicamente informativo. No somos organizadores de ninguna lotería. La información presentada tiene un carácter meramente informativo y orientativo. Los resultados mostrados no constituyen la información oficial de las respectivas loterías.`;

  logger.info("Starting to publish results", {
    context: { description, lottery, game, url, formattedDate, urls },
  });
  await Promise.all(
    publishers.map((publisher) =>
      publisher
        .publish(
          description,
          lottery,
          game,
          createLogger,
          urls[publisher.keyVersion as keyof typeof urls]
        )
        .catch((error) => {
          console.error(error);
          return null;
        })
    )
  );

  logger.info("Finished publishing results", {
    context: { lottery, game, dte },
  });
};
