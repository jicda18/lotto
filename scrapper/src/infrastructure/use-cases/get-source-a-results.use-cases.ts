import { LuxonAdapter } from "../../config";
import { Scrapper } from "../../domain";

export type SourceAScrapperOptions = { lottery: string; game: string };

export const GetSourceAResultsUseCase: Scrapper<
  SourceAScrapperOptions
> = async (dte, options, page, CreateLogger) => {
  const logger = CreateLogger("get-source-a-results.use-cases.ts");

  const { lottery, game } = options;
  const dt = LuxonAdapter.format(dte, "dd-MM-yyyy");
  const url = `https://sourceA.com/${lottery}/${game}?date=${dt}`; // hypothetical URL

  logger.info(`searching results for ${lottery} - ${game}`, {
    context: { lottery, game, dt },
  });

  try {
    logger.info(`Navigating to URL: ${url}`, { context: { url } });

    // Example logic extracting results from a hypothetical page structure
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const block = await page.$(".result-box");

    const resultDt = await block?.$eval(".game-info .game-date", (dte) =>
      dte.textContent?.trim()
    );
    const numbers = await block?.$$eval(".game-scores .score", (results) =>
      results.map((result) => {
        const resultStr = (result.textContent ?? "").trim();

        const resultAsNumber = Number(resultStr);

        return !isNaN(resultAsNumber) && isFinite(resultAsNumber)
          ? resultAsNumber
          : resultStr;
      })
    );

    if (!resultDt || !numbers?.length) {
      logger.warn(`Cant't find date or results blocks`, {
        context: { lottery, game, resultDt, numbers },
      });
      return [];
    }

    if (
      !LuxonAdapter.compare(
        dte,
        LuxonAdapter.fromFormat(resultDt, "dd-MM"),
        "same:day"
      )
    ) {
      logger.info(`Date mismatch`, {
        context: { lottery, game, dte },
      });
      return [];
    }

    logger.info(`Found results for ${lottery} - ${game}`, {
      context: { lottery, game, resultDt, numbers },
    });

    return [...numbers];
  } catch (error) {
    logger.error(`Error fetching results for ${lottery} - ${game}`, {
      context: { lottery, game, error },
    });
  }

  return [];
};
