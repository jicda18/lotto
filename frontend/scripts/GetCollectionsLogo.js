import fs from "node:fs";
import path from "node:path";

const fetchAllEntries = async (endpoint) => {
  const data = [];

  let currentPage = 1;
  let totalPages = 1;
  const baseUrl = process.env.VITE_OAPI_URL;

  while (currentPage <= totalPages) {
    const url = `${baseUrl}/${endpoint}?page=${currentPage}`;

    const response = await fetch(url);

    if (!response.ok) {
      continue;
    }

    const { entries, pagination } = await response.json();

    data.push(...entries);

    totalPages = pagination.totalPages;
    currentPage++;
  }

  return data;
};

const makeCollections = async () => {
  console.info("Getting lotteries...");
  const lotteries = await fetchAllEntries("lotteries");

  console.info("Getting games...");
  const games = (
    await Promise.all(
      lotteries.map((lottery) =>
        fetchAllEntries(`lotteries/${lottery.id}/games`)
      )
    )
  ).flat();

  console.info("creating data collections files...");

  const outDir = path.resolve(`src/data/`);

  const lotteriesFilePath = path.join(outDir, "lotteries.json");
  const gamesFilePath = path.join(outDir, "games.json");

  if (fs.existsSync(lotteriesFilePath)) fs.rmSync(lotteriesFilePath);
  if (fs.existsSync(gamesFilePath)) fs.rmSync(gamesFilePath);

  fs.writeFileSync(lotteriesFilePath, JSON.stringify(lotteries, null, 2), {
    encoding: "utf-8",
  });

  fs.writeFileSync(gamesFilePath, JSON.stringify(games, null, 2), {
    encoding: "utf-8",
  });

  return { lotteries, games };
};

const downloadLogo = async (collection, entries) => {
  console.info(`Downloading images for ${collection}...`);

  const outDir = path.resolve(`src/assets/${collection}`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const entry of entries) {
    const url = entry.logo;
    if (!url) continue;

    const filename = `${entry.id}${path.extname(new URL(url).pathname)}`;
    const dest = path.join(outDir, filename);

    if (fs.existsSync(dest)) fs.rmSync(dest);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`Error downloaded ${url}`);
        continue;
      }

      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      console.info(`Saving: ${filename}`);
    } catch (err) {
      console.error(`Downloading error ${url}: ${err.message}`);
    }
  }

  console.info(`End for ${collection}...`);
};

const main = async () => {
  const { lotteries, games } = await makeCollections();

  await Promise.all([
    downloadLogo("lotteries", lotteries),
    downloadLogo("games", games),
  ]);
};

main().then(() => console.log("end script"));
