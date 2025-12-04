import "dotenv/config";
import { get } from "env-var";

export const envs = {
  NODE_ENV: get("NODE_ENV").default("production").asString(),
  REDIS_HOST: get("REDIS_HOST").required().asString(),
  REDIS_PORT: get("REDIS_PORT").required().asPortNumber(),
  EVENT_NAME: get("EVENT_NAME").required().asString(),
  OAPI_BASE_URL: get("OAPI_BASE_URL").required().asString(),

  META_APP_ID: get("META_APP_ID").required().asString(),
  META_APP_SECRET: get("META_APP_SECRET").required().asString(),
  META_VERSION: get("META_VERSION").default("v24.0").asString(),
  FB_PAGE_TOKEN: get("FB_PAGE_TOKEN").required().asString(),
  FB_PAGE_ID: get("FB_PAGE_ID").required().asString(),
};
