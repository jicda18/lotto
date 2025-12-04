import { PrismaClient } from "@prisma/client";
import { envs, loggerFactory, generateUUID, isValidUUID } from "../config";
import { GameTask } from "../domain";
import { args } from "./config/args-add-task.plugin";
import { DateTime } from "luxon";
import {
  AddGamesSearchToQueueUseCase,
  RedisQueueRepository,
} from "../infrastructure";

const client = new PrismaClient();

const main = async () => {
  const CreateLogger = loggerFactory(generateUUID());
  const logger = CreateLogger("add-task.ts");

  const queue = new RedisQueueRepository<GameTask>(
    envs.REDIS_HOST,
    envs.REDIS_PORT,
    envs.SUB_QUEUE_NAME,
    CreateLogger
  );

  const { lotteries, games: gms, all, delay } = args;
  const dte = DateTime.fromISO(args.date).toJSDate();

  logger.info("Adding task to queue", {
    context: { dte, lotteries, games: gms, all, delay },
  });

  let games = [];
  if (all) {
    games = await client.game.findMany();
  } else {
    if (gms.length) {
      games = await client.game.findMany({
        where: {
          OR: [
            { id: { in: gms.filter(isValidUUID) } },
            { name: { in: gms.filter((txt) => !isValidUUID(txt)) } },
          ],
        },
      });
    } else {
      games = await client.game.findMany({
        where: {
          lottery: {
            is: {
              OR: [
                { id: { in: lotteries.filter(isValidUUID) } },
                { name: { in: lotteries.filter((txt) => !isValidUUID(txt)) } },
              ],
            },
          },
        },
      });
    }
  }

  if (games.length === 0) {
    console.warn("No games found for the specified criteria");
    logger.warn("No games found for the specified criteria", {
      context: { dte, lotteries, games: gms, all, delay },
    });
    return;
  }

  for (const game of games) {
    AddGamesSearchToQueueUseCase({ games, queue, CreateLogger, dte });
  }
};

console.log("Starting task addition process...");
main()
  .then(() => {
    console.log("Tasks added successfully");
  })
  .catch((error) => {
    console.error("Error adding task:", error);
  })
  .finally(async () => {
    await client.$disconnect();
    console.log("End process");
  });
