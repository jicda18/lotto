import { envs } from "../config";
import { RedisQueueRepository } from "../infrastructure";

const main = async () => {
  const [MAIN_QUEUE_NAME, SUB_QUEUE_NAME] = await Promise.all([
    RedisQueueRepository.summary(
      envs.REDIS_HOST,
      envs.REDIS_PORT,
      envs.MAIN_QUEUE_NAME
    ),
    RedisQueueRepository.summary(
      envs.REDIS_HOST,
      envs.REDIS_PORT,
      envs.SUB_QUEUE_NAME
    ),
  ]);

  console.log(
    `Queue ${envs.MAIN_QUEUE_NAME}:`,
    JSON.stringify(MAIN_QUEUE_NAME, null, 2),
    "\n"
  );

  console.log(
    `Queue ${envs.SUB_QUEUE_NAME}:`,
    JSON.stringify(SUB_QUEUE_NAME, null, 2),
    "\n"
  );
};

console.log("Starting task summary process...");
main()
  .then(() => {})
  .catch((error) => {
    console.error("Error:", error);
  })
  .finally(async () => {
    console.log("End process");
  });
