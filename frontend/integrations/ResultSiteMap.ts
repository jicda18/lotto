import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroConfig, AstroIntegration } from "astro";

interface Lottery {
  id: string;
  name: string;
  slug: string;
  logo: string;
  location: string;
  createdAt: Date;
  deletedAt: null;
  links: {
    self: string;
    games: string;
  };
}

interface Game {
  id: string;
  lotteryId: string;
  name: string;
  slug: string;
  logo: string;
  resultTime: string;
  resultRenderComponent: string;
  createdAt: Date;
  deletedAt: null;
  links: {
    self: string;
    lottery: string;
    results: string;
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (outFile: string): AstroIntegration => {
  let config: AstroConfig;

  return {
    name: "result-sitemap",
    hooks: {
      "astro:config:done": async ({ config: cfg }) => {
        config = cfg;
      },
      "astro:build:done": async ({ dir, logger }) => {
        if (!config.site) {
          logger.warn(
            "The Result Sitemap integration requires the `site` astro.config option. Skipping."
          );
          return;
        }

        const lotteriesFilePath = path.resolve(
          __dirname,
          "../src/data/lotteries.json"
        );
        const gamesFilePath = path.resolve(__dirname, "../src/data/games.json");

        if (
          !fs.existsSync(lotteriesFilePath) ||
          !fs.existsSync(gamesFilePath)
        ) {
          logger.warn(
            "Lottery or Game data files not found. Skipping sitemap generation."
          );
          return;
        }

        const lotteries = JSON.parse(
          fs.readFileSync(lotteriesFilePath, "utf-8")
        ) as Lottery[];
        const games = JSON.parse(
          fs.readFileSync(gamesFilePath, "utf-8")
        ) as Game[];

        const lotteriesMap = new Map(
          lotteries.map((lottery) => [lottery.id, lottery])
        );

        const urls = games
          .map((game) => {
            const lottery = lotteriesMap.get(game.lotteryId);

            return lottery
              ? `${config.site}/lotteries/${lottery.slug}/games/${game.slug}`
              : "";
          })
          .filter((url) => url);

        if (urls.length === 0) {
          logger.warn(`No pages found! \`${outFile}\` not created.`);
          return;
        }

        const destDir = fileURLToPath(dir);
        const filePath = path.join(destDir, outFile);

        const openContent =
          '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">';
        const closeContent = "</urlset>";
        const urlContent = urls
          .map((url) => `<url><loc>${url}</loc></url>`)
          .join("");
        const sitemapContent = `${openContent}${urlContent}${closeContent}`;

        fs.writeFileSync(filePath, sitemapContent, "utf-8");

        logger.info(
          `\`${outFile}\` created at \`${path.relative(
            process.cwd(),
            destDir
          )}\``
        );
      },
    },
  };
};
