import { envs } from "./config";
import {
  ImagesBuffers,
  OapiResourceRepository,
  RedisConsumerRepository,
} from "./infrastructure";
import { RedisPublisher } from "./infrastructure/repositories/redis-publisher.repository";
import { S3ContaboSaverRepository } from "./infrastructure/repositories/s3Contabo-saver.repository";
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

  const publisher = new RedisPublisher(
    envs.REDIS_HOST,
    envs.REDIS_PORT,
    envs.PUBLISHER_EVENT_NAME
  );

  const resources = new OapiResourceRepository(envs.OAPI_BASE_URL);

  // const saver = new LocalSaverRepository<ImagesBuffers>();
  const saver = new S3ContaboSaverRepository<ImagesBuffers>({
    endpoint: envs.AWS_ENDPOINT,
    accessKey: envs.AWS_ACCESS_KEY_ID,
    secretKey: envs.AWS_SECRET_ACCESS_KEY,
    region: envs.AWS_REGION,
    bucket: envs.AWS_S3_BUCKET,
    tenantId: envs.TENANT_ID,
  });

  const server = new Server(consumer, publisher, resources, saver);

  await server.start();
}
