import { Browser, BrowserPage, Client, LuxonAdapter } from "../../config";
import { Game, GameTask, Publisher, Task } from "../../domain";
import {
  FactoryScrapper,
  SaveResultsUseCase,
  ScrapperFactory,
} from "../../infrastructure";
import { FactoryLogger, Logger } from "../../config/plugins/logger";

export type ProcessorPublisherEvent = {
  gameId: string;
  lotteryId: string;
  results: string;
  dte: string;
  traceId: string;
};

export class ProcessorService {
  public constructor(
    private readonly browser: Browser,
    private readonly client: Client,
    private readonly publisher: Publisher<ProcessorPublisherEvent>,
    private readonly loggerFactory: FactoryLogger
  ) {}

  gameProcessor = async (job: Task<GameTask>) => {
    const CreateLogger = this.loggerFactory(job.data.traceId);
    const logger: Logger = CreateLogger("processor.service.ts");

    logger.info(`Start processing game: ${job.data.name}`, {
      context: { jobId: job.id, game: job.data },
    });

    const { searchDate, traceId, ...game } = job.data;

    const dte = LuxonAdapter.toDate(searchDate);

    let page: BrowserPage | undefined;
    try {
      page = await this.browser.newPage();

      if (
        !Object.prototype.hasOwnProperty.call(
          ScrapperFactory,
          game.wrapRepository
        )
      ) {
        logger.error(`No scrapper found for: ${game.wrapRepository}`, {
          context: { ...job.data },
        });
        return;
      }

      const scrapper =
        ScrapperFactory[game.wrapRepository as keyof FactoryScrapper];

      const results = await scrapper(
        dte,
        game.options as any,
        page,
        CreateLogger
      );

      const saved = await SaveResultsUseCase(
        this.client,
        CreateLogger,
        results,
        game,
        dte
      );

      if (saved) {
        const id = await this.publisher.publish({
          gameId: game.id,
          lotteryId: game.lotteryId,
          results: JSON.stringify(results),
          dte: dte.toISOString(),
          traceId,
        });

        if (id)
          logger.info(`Event published. id: ${id}`, {
            context: {
              id,
              gameId: game.id,
              lotteryId: game.lotteryId,
              results: JSON.stringify(results),
              dte: dte.toISOString(),
              traceId,
            },
          });
      }
    } catch (error) {
      logger.error(`Error processing game: ${job.data.name}`, {
        context: { ...job.data, error: (error as Error).message },
      });
    } finally {
      logger.info(`End processing game: ${job.data.name}`, {
        context: { jobId: job.id, game: job.data },
      });
      await page?.close();
    }
  };
}
