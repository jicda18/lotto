import { envs } from "./config";
import { PublisherRepository } from "./domain";
import {
  FBPublisherRepository,
  OapiResourceRepository,
  RedisConsumerRepository,
} from "./infrastructure";

import { Server } from "./presentation";

(async () => {
  main();
})();

async function main() {
  const consumer = new RedisConsumerRepository(
    envs.REDIS_HOST,
    envs.REDIS_PORT,
    envs.EVENT_NAME
  );

  const resources = new OapiResourceRepository(envs.OAPI_BASE_URL);

  const publishers: PublisherRepository[] = [
    new FBPublisherRepository(
      envs.FB_PAGE_ID,
      envs.FB_PAGE_TOKEN,
      envs.META_VERSION
    ),
  ];

  const server = new Server(consumer, resources, publishers);

  await server.start();
}
