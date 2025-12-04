import { RedisPublisher } from "../infrastructure";
import { ProcessorPublisherEvent } from "../presentation";
import { envs, generateUUID, LuxonAdapter } from "../config";
import { args } from "./config/args-add-event.plugin";

const publisher = new RedisPublisher<ProcessorPublisherEvent>(
  envs.REDIS_HOST,
  envs.REDIS_PORT,
  envs.EVENT_NAME
);

const main = async () => {
  const { date, lottery, game, results } = args;

  return await publisher.publish({
    gameId: game as string,
    lotteryId: lottery as string,
    results: JSON.stringify((results as string).split(",")),
    dte: LuxonAdapter.toDate(date as string).toISOString(),
    traceId: generateUUID(),
  });
};

console.log("Starting event addition process...");
main()
  .then((id) => {
    console.log(`Event added successfully. Id: ${id}`);
  })
  .catch((error) => {
    console.error("Error adding event:", error);
  })
  .finally(async () => {
    await publisher.disconect();
    console.log("End process");
  });
