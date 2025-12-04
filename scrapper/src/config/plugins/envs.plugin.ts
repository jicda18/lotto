import "dotenv/config";
import { get } from "env-var";

export const envs = {
  NODE_ENV: get("NODE_ENV").default("production").asString(),
  DATABASE_URL: get("DATABASE_URL").required().asString(),
  BROWSERLESS_WS_ENDPOINT: get("BROWSERLESS_WS_ENDPOINT").required().asString(),
  REDIS_HOST: get("REDIS_HOST").required().asString(),
  REDIS_PORT: get("REDIS_PORT").required().asPortNumber(),
  MAIN_QUEUE_NAME: get("MAIN_QUEUE_NAME").required().asString(),
  SUB_QUEUE_NAME: get("SUB_QUEUE_NAME").required().asString(),
  QUEUE_CONCURRENCY: get("QUEUE_CONCURRENCY").default("1").asIntPositive(),
  EVENT_NAME: get("EVENT_NAME").required().asString(),
};
