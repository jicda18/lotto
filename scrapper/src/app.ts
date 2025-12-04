import { envs } from "./config";
import { Server } from "./presentation";

(async () => {
  main();
})();

async function main() {
  const server = new Server(
    envs.BROWSERLESS_WS_ENDPOINT,
    envs.REDIS_HOST,
    envs.REDIS_PORT,
    envs.MAIN_QUEUE_NAME,
    envs.SUB_QUEUE_NAME,
    envs.QUEUE_CONCURRENCY,
    envs.EVENT_NAME
  );

  server.start();
}
