import { LuxonAdapter } from "../../config";
import { Scrapper } from "../../domain";

export type SourceBScrapperOptions = { game: string };

export const GetSourceBResultsUseCase: Scrapper<
  SourceBScrapperOptions
> = async (dte, options, page, CreateLogger) => {
  const logger = CreateLogger("get-source-b-results.use-cases.ts");

  const { game } = options;
  const dt = LuxonAdapter.format(dte, "yyyy-MM-dd");
  const url = `https://sourceB.com/resultados-${game}-${dt}`; // hypothetical URL

  logger.info(`searching results for ${game}`, {
    context: { game, dt },
  });

  try {
    logger.info(`Navigating to URL: ${url}`, { context: { url } });

    // Example logic extracting results from a hypothetical page structure
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const results = await page.$(".row#results");

    const block = await results?.$(".result-box");

    const resultDt = await block?.$eval(".result-date", (dte) =>
      dte.textContent?.trim()
    );
    const numbers = await block?.$$eval(
      '.results:not([style*="visibility: hidden;"])',
      (results) =>
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
        context: { game, resultDt, numbers },
      });

      return [];
    }

    if (
      !LuxonAdapter.compare(
        dte,
        LuxonAdapter.fromFormat(resultDt, "cccc dd 'de' LLLL, yyyy", {
          locale: "es",
        }),
        "same:day"
      )
    ) {
      logger.info(`Date mismatch`, {
        context: { game, dte },
      });
      return [];
    }

    logger.info(`Found results for ${game}`, {
      context: { game, resultDt, numbers },
    });

    return [...numbers];
  } catch (error) {
    logger.error(`Error fetching results for ${game}`, {
      context: { game, error },
    });
  }

  return [];
};
