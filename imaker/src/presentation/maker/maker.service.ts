import { CreateLogger } from "../../config";
import {
  DrawerRepository,
  ResourcesRepository,
  SaverRepository,
} from "../../domian";
import {
  EventDTO,
  ImagesBuffers,
  MakeImageResultsUseCase,
} from "../../infrastructure";

export const MakerService = async (
  event: EventDTO,
  resources: ResourcesRepository,
  drawer: DrawerRepository,
  saver: SaverRepository<ImagesBuffers>,
  createLogger: CreateLogger
) => {
  const logger = createLogger("make.service.ts");

  const [lottery, game] = await Promise.all([
    resources.getLottery(event.lotteryId, createLogger),
    resources.getGame(event.gameId, createLogger),
  ]);

  if (!lottery || !game) {
    logger.warn("Lottery or Game not found", { context: { lottery, game } });

    return;
  }

  logger.info("Lottery and Game found", { context: { lottery, game } });

  const images = await MakeImageResultsUseCase(
    game,
    lottery,
    event.results,
    event.dte,
    drawer,
    createLogger
  );

  logger.info("Images generated successfully", { context: { event } });

  const urls = await saver.save(images);

  logger.info("Images saved successfully", { context: { urls } });

  return {
    ...urls,
    lotteryId: event.lotteryId,
    gameId: event.gameId,
    dte: event.dte.toISOString(),
    traceId: event.traceId,
  };
};
