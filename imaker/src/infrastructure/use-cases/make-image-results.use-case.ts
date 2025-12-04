import { CreateLogger, LuxonAdapter } from "../../config";
import { Game, Lottery, DrawerRepository, Size } from "../../domian";
import { BallColorGeneratorFactory } from "../ball-color-generator.factory";

export type ImagesBuffers = {
  v045: NodeJS.ArrayBufferView;
  v916: NodeJS.ArrayBufferView;
  v169: NodeJS.ArrayBufferView;
  v191: NodeJS.ArrayBufferView;
};

export const MakeImageResultsUseCase = async (
  game: Game,
  lottery: Lottery,
  results: (string | number)[],
  dte: Date,
  drawer: DrawerRepository,
  createLogger: CreateLogger
): Promise<ImagesBuffers> => {
  const logger = createLogger("make-image-results.use-case.ts");

  const gameName = game.name;
  const dt = LuxonAdapter.format(dte, "dd/MM/yyyy");
  const balls = results.map((result) => result.toString().padStart(2, "0"));

  const size045: Size = [820, 1024];
  const size916: Size = [576, 1024];
  const size169: Size = [1024, 576];
  const size191: Size = [1080, 536];

  logger.info("Starting to draw images", {
    context: {
      gameName,
      dt,
      balls,
      sizes: [size045, size916, size169, size191],
    },
  });

  const ballColorGenerator = Object.hasOwn(
    BallColorGeneratorFactory,
    game.resultRenderComponent
  )
    ? BallColorGeneratorFactory[game.resultRenderComponent]
    : BallColorGeneratorFactory.default;
  const [v045, v916, v169, v191] = await drawer.draw(
    gameName,
    lottery.logo,
    dt,
    balls,
    [5, 4, 8, 8],
    ballColorGenerator,
    [size045, size916, size169, size191]
  );

  logger.info("Finished drawing images", { context: { gameName, dt, balls } });

  return { v045, v916, v169, v191 };
};
