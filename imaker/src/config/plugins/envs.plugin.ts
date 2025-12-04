import "dotenv/config";
import { get } from "env-var";

export const envs = {
  NODE_ENV: get("NODE_ENV").default("production").asString(),
  REDIS_HOST: get("REDIS_HOST").required().asString(),
  REDIS_PORT: get("REDIS_PORT").required().asPortNumber(),
  EVENT_NAME: get("EVENT_NAME").required().asString(),
  PUBLISHER_EVENT_NAME: get("PUBLISHER_EVENT_NAME").required().asString(),
  OAPI_BASE_URL: get("OAPI_BASE_URL").required().asString(),
  AWS_ENDPOINT: get("AWS_ENDPOINT").required().asString(),
  AWS_ACCESS_KEY_ID: get("AWS_ACCESS_KEY_ID").required().asString(),
  AWS_SECRET_ACCESS_KEY: get("AWS_SECRET_ACCESS_KEY").required().asString(),
  AWS_REGION: get("AWS_REGION").required().asString(),
  AWS_S3_BUCKET: get("AWS_S3_BUCKET").required().asString(),
  TENANT_ID: get("TENANT_ID").required().asString(),
};
